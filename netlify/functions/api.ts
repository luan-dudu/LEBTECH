import serverless from 'serverless-http';
import express, { type NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import {
  createTechnicalSupportRequest,
  createConsultingRequest,
  createEquipmentSalesRequest,
  createContactMessage,
  createItProjectRequest,
  createItManagementRequest,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  findUserByEmail,
  verifyUserPassword,
  updateSubmissionStatus,
  updateSubmissionAiProposal,
  updateSubmissionAiAnalysis,
  ensureSchema,
  isPanelStatus,
  isSubmissionType,
  type SubmissionType,
  type UserRole,
} from '../../server/db';
import { runAiChat, generateAiProposal, analyzeAiSubmission, AiUserError } from '../../server/ai';
import { listAdminSubmissions } from '../../server/submissions';
import { isRateLimited } from '../../server/rate-limit';

const app = express();

app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true }));

const TEN_MINUTES = 10 * 60 * 1000;
const PUBLIC_ERROR =
  'Não foi possível enviar agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp (12) 98817-6687.';

function clientIp(req: Request) {
  const raw = req.headers['x-nf-client-connection-ip'] || req.headers['x-forwarded-for'] || req.ip || 'anon';
  return String(raw).split(',')[0].trim();
}

// Garante colunas/tabelas novas do schema antes de qualquer rota da API
app.use('/api', async (_req, _res, next) => {
  try {
    await ensureSchema();
  } catch (error) {
    console.error('[LEB API] Falha ao sincronizar schema do banco:', error);
  }
  next();
});

// ─── FORMULÁRIOS PÚBLICOS ─────────────────────────────────────────────────────
// Só os campos esperados são gravados, com os limites de tamanho das colunas.

const LONG_TEXT = 10_000;

const required = (label: string, max: number) =>
  z
    .string({ error: `Preencha o campo ${label}.` })
    .trim()
    .min(1, `Preencha o campo ${label}.`)
    .max(max, `O campo ${label} aceita no máximo ${max} caracteres.`);

const optional = (label: string, max: number) =>
  z
    .string({ error: `O campo ${label} é inválido.` })
    .trim()
    .max(max, `O campo ${label} aceita no máximo ${max} caracteres.`)
    .optional()
    .transform((value) => value || undefined);

const email = z
  .string({ error: 'Informe um e-mail válido.' })
  .trim()
  .max(320, 'O e-mail informado é muito longo.')
  .email('Informe um e-mail válido.');

const contactFields = {
  name: required('Nome', 255),
  email,
  phone: required('Telefone', 20),
};

// Colunas "company" obrigatórias no banco aceitam texto vazio
const companyOrEmpty = optional('Empresa', 255).transform((value) => value ?? '');

const supportSchema = z.object({
  ...contactFields,
  company: companyOrEmpty,
  problemType: required('Tipo de problema', 50),
  urgency: required('Urgência', 50),
  description: required('Descrição do problema', LONG_TEXT),
});

const equipmentSchema = z.object({
  ...contactFields,
  company: companyOrEmpty,
  equipmentType: required('Tipo de equipamento', 100),
  quantity: z.coerce
    .number({ error: 'Informe a quantidade.' })
    .int('A quantidade deve ser um número inteiro.')
    .min(1, 'A quantidade deve ser pelo menos 1.')
    .max(100_000, 'A quantidade informada é muito alta.'),
  specifications: required('Especificações', LONG_TEXT),
  budget: optional('Orçamento', 100),
  timeline: required('Prazo', 50),
});

const consultingSchema = z.object({
  ...contactFields,
  company: companyOrEmpty,
  consultingType: required('Tipo de consultoria', 100),
  currentChallenges: required('Desafios atuais', LONG_TEXT),
  objectives: required('Objetivos', LONG_TEXT),
  teamSize: optional('Tamanho da equipe', 50),
  budget: optional('Orçamento', 100),
});

const contactSchema = z.object({
  name: required('Nome', 255),
  email,
  phone: optional('Telefone', 20),
  company: optional('Empresa', 255),
  subject: optional('Assunto', 255).transform((value) => value ?? 'Contato via site'),
  message: required('Mensagem', LONG_TEXT),
});

const projectsSchema = z.object({
  ...contactFields,
  company: optional('Empresa', 255),
  projectType: required('Tipo de projeto', 100),
  timeline: required('Prazo', 50),
  budget: required('Orçamento', 50),
  description: required('Descrição do projeto', LONG_TEXT),
});

const managementSchema = z.object({
  ...contactFields,
  company: optional('Empresa', 255),
  managementType: required('Tipo de gestão', 100),
  userCount: required('Quantidade de usuários', 50),
  infrastructure: required('Infraestrutura', 50),
  challenges: required('Desafios', LONG_TEXT),
});

function publicForm<S extends z.ZodType>(
  path: string,
  schema: S,
  save: (data: z.output<S>) => Promise<{ id: number } | undefined>
) {
  app.post(path, async (req, res) => {
    if (isRateLimited(`form:${clientIp(req)}`, 20, TEN_MINUTES)) {
      return res.status(429).json({ success: false, error: 'Muitos envios em pouco tempo. Aguarde alguns minutos.' });
    }
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' });
    }
    try {
      const saved = await save(parsed.data);
      res.json({ success: true, data: { id: saved?.id } });
    } catch (error) {
      console.error(`[LEB API] Falha ao salvar ${path}:`, error);
      res.status(500).json({ success: false, error: PUBLIC_ERROR });
    }
  });
}

publicForm('/api/support', supportSchema, createTechnicalSupportRequest);
publicForm('/api/equipment', equipmentSchema, createEquipmentSalesRequest);
publicForm('/api/consulting', consultingSchema, createConsultingRequest);
publicForm('/api/contact', contactSchema, createContactMessage);
publicForm('/api/projects', projectsSchema, createItProjectRequest);
publicForm('/api/management', managementSchema, createItManagementRequest);

// ─── LEB IA — ATENDIMENTO N1 ──────────────────────────────────────────────────

app.post('/api/ai/chat', async (req, res) => {
  if (isRateLimited(`chat:${clientIp(req)}`, 30, TEN_MINUTES)) {
    return res.status(429).json({ success: false, error: 'Muitas mensagens em pouco tempo. Aguarde alguns minutos.' });
  }
  try {
    const result = await runAiChat(req.body?.messages);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof AiUserError) {
      return res.status(400).json({ success: false, error: error.message });
    }
    // Detalhes (ex.: chave não configurada) ficam só no log do servidor
    console.error('[LEB IA] Falha no atendimento:', error);
    res.status(503).json({ success: false, error: 'O assistente está indisponível no momento.' });
  }
});

// ─── AUTENTICAÇÃO DO PAINEL ───────────────────────────────────────────────────

type AdminSession = { email: string; role: UserRole };

const TOKEN_TTL_SECONDS = 24 * 60 * 60;

function tokenSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  // Sem JWT_SECRET: deriva de um segredo que só existe no servidor — nunca de
  // uma constante escrita no código, que qualquer pessoa com o código leria.
  const serverSecret = process.env.DATABASE_URL || process.env.ADMIN_PASSWORD;
  if (!serverSecret) throw new Error('Configure a variável JWT_SECRET no servidor.');
  return crypto.createHash('sha256').update(`lebtech-admin-token:${serverSecret}`).digest('hex');
}

function sign(data: string) {
  return crypto.createHmac('sha256', tokenSecret()).update(data).digest('base64url');
}

function generateToken(session: AdminSession): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({ ...session, iat: now, exp: now + TOKEN_TTL_SECONDS })
  ).toString('base64url');
  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

function verifyToken(token: string): AdminSession | null {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;
    const expected = Buffer.from(sign(`${header}.${payload}`));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null;
    // Tokens emitidos antes da existência de "role" só eram dados ao admin principal
    return { email: String(data.email), role: data.role === 'user' ? 'user' : 'admin' };
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string) {
  const digest = (value: string) => crypto.createHash('sha256').update(value).digest();
  return crypto.timingSafeEqual(digest(a), digest(b));
}

app.post('/api/admin/login', async (req, res) => {
  if (isRateLimited(`login:${clientIp(req)}`, 10, 15 * 60 * 1000)) {
    return res.status(429).json({ success: false, error: 'Muitas tentativas de login. Aguarde 15 minutos e tente novamente.' });
  }
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios.' });
    }

    const inputEmail = email.trim().toLowerCase();
    const adminEmailEnv = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const defaultEmails = ['admin@lebtech.com', 'admin@lebtech.com.br'];
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const isMatchAdminEmail = defaultEmails.includes(inputEmail) || (adminEmailEnv && inputEmail === adminEmailEnv);

    if (isMatchAdminEmail && safeEqual(password, adminPassword)) {
      return res.json({ success: true, token: generateToken({ email: inputEmail, role: 'admin' }) });
    }

    // Checar usuários cadastrados no banco
    const user = await verifyUserPassword(inputEmail, password).catch((err) => {
      console.error('[LEB API] Falha ao verificar usuário:', err);
      return null;
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos!',
      });
    }

    res.json({ success: true, token: generateToken({ email: user.email || inputEmail, role: user.role }) });
  } catch (error: any) {
    console.error('[LEB API] Falha no login:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao realizar login.' });
  }
});

// Todas as demais rotas /api/admin exigem um token válido
app.use('/api/admin', (req, res, next) => {
  if (req.path === '/login') return next();
  const auth = req.headers.authorization || '';
  const session = auth.startsWith('Bearer ') ? verifyToken(auth.slice(7)) : null;
  if (!session) {
    return res.status(401).json({ success: false, error: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
  res.locals.session = session;
  next();
});

function requireAdminRole(_req: Request, res: Response, next: NextFunction) {
  if ((res.locals.session as AdminSession | undefined)?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Apenas administradores podem gerenciar usuários.' });
  }
  next();
}

// ─── ADMIN — SUBMISSIONS ──────────────────────────────────────────────────────

app.get('/api/admin/submissions', async (_req, res) => {
  try {
    res.json({ success: true, data: await listAdminSubmissions() });
  } catch (error: any) {
    console.error('[LEB API] Falha ao listar solicitações:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

function parseSubmissionRef(body: any): { type: SubmissionType; id: number } | null {
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id <= 0 || !isSubmissionType(body?.type)) return null;
  return { type: body.type, id };
}

app.put('/api/admin/submissions/status', async (req, res) => {
  const ref = parseSubmissionRef(req.body);
  if (!ref) return res.status(400).json({ success: false, error: 'Solicitação inválida.' });
  const { status } = req.body;
  if (!isPanelStatus(status)) {
    return res.status(400).json({ success: false, error: `Status inválido: ${status}` });
  }
  try {
    const found = await updateSubmissionStatus(ref.type, ref.id, status);
    if (!found) return res.status(404).json({ success: false, error: 'Solicitação não encontrada.' });
    res.json({ success: true });
  } catch (error: any) {
    console.error('[LEB API] Falha ao atualizar status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const isFilled = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

// ✨ Gerador Automático de Propostas com IA
app.post('/api/admin/ai/proposal', async (req, res) => {
  const { name, company, phone, email, description } = req.body || {};
  if (!isFilled(name) || !isFilled(description)) {
    return res.status(400).json({ success: false, error: 'Nome e descrição são obrigatórios.' });
  }
  const ref = parseSubmissionRef(req.body);
  try {
    const proposal = await generateAiProposal({ type: ref?.type || 'Geral', name, company, phone, email, description });
    if (ref) await updateSubmissionAiProposal(ref.type, ref.id, proposal);
    res.json({ success: true, proposal });
  } catch (error: any) {
    console.error('[LEB IA] Erro ao gerar proposta:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎯 Triagem e Classificação Inteligente com IA
app.post('/api/admin/ai/analyze', async (req, res) => {
  const { name, company, description } = req.body || {};
  if (!isFilled(name) || !isFilled(description)) {
    return res.status(400).json({ success: false, error: 'Nome e descrição são obrigatórios.' });
  }
  const ref = parseSubmissionRef(req.body);
  try {
    const analysis = await analyzeAiSubmission({ type: ref?.type || 'Geral', name, company, description });
    if (ref) await updateSubmissionAiAnalysis(ref.type, ref.id, analysis);
    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('[LEB IA] Erro ao analisar chamado:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Salvar proposta editada manualmente pelo admin
app.put('/api/admin/submissions/proposal', async (req, res) => {
  const ref = parseSubmissionRef(req.body);
  if (!ref) return res.status(400).json({ success: false, error: 'ID e tipo são obrigatórios.' });
  const { proposal } = req.body;
  if (typeof proposal !== 'string') {
    return res.status(400).json({ success: false, error: 'Proposta inválida.' });
  }
  try {
    const found = await updateSubmissionAiProposal(ref.type, ref.id, proposal);
    if (!found) return res.status(404).json({ success: false, error: 'Solicitação não encontrada.' });
    res.json({ success: true });
  } catch (error: any) {
    console.error('[LEB API] Falha ao salvar proposta:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── ADMIN — USERS ────────────────────────────────────────────────────────────

const userSchema = z.object({
  name: z.string({ error: 'Informe o nome.' }).trim().min(1, 'Informe o nome.').max(255, 'Nome muito longo.'),
  email,
  role: z.enum(['admin', 'user'], { error: 'Função inválida.' }),
  // Vazio = sem senha nova (na edição, mantém a atual)
  password: z
    .string()
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => value === undefined || value.length >= 6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const toSafeUser = ({ passwordHash, openId, ...user }: Record<string, any>) => user;

function parseUserId(param: string) {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get('/api/admin/users', requireAdminRole, async (_req, res) => {
  try {
    const users = await getUsers();
    // Nunca retornar o hash de senha
    res.json({ success: true, data: users.map(toSafeUser) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/users', requireAdminRole, async (req, res) => {
  const parsed = userSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' });
  }
  const { password, ...data } = parsed.data;
  if (!password) {
    return res.status(400).json({ success: false, error: 'Informe uma senha com pelo menos 6 caracteres.' });
  }
  try {
    if (await findUserByEmail(data.email)) {
      return res.status(409).json({ success: false, error: 'Já existe um usuário com este e-mail.' });
    }
    const user = await createUser({ ...data, password });
    res.json({ success: true, data: toSafeUser(user) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.cause ? error.cause.message : error.message });
  }
});

app.put('/api/admin/users/:id', requireAdminRole, async (req, res) => {
  const id = parseUserId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: 'Usuário inválido.' });
  const parsed = userSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' });
  }
  try {
    const existing = await findUserByEmail(parsed.data.email);
    if (existing && existing.id !== id) {
      return res.status(409).json({ success: false, error: 'Já existe um usuário com este e-mail.' });
    }
    const user = await updateUser(id, parsed.data);
    if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    res.json({ success: true, data: toSafeUser(user) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.cause ? error.cause.message : error.message });
  }
});

app.delete('/api/admin/users/:id', requireAdminRole, async (req, res) => {
  const id = parseUserId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: 'Usuário inválido.' });
  try {
    const found = await deleteUser(id);
    if (!found) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── FALLBACKS ────────────────────────────────────────────────────────────────

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'Rota não encontrada.' });
});

// JSON malformado, corpo grande demais ou erro inesperado: sempre responde JSON
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Requisição inválida.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'O conteúdo enviado é grande demais.' });
  }
  console.error('[LEB API] Erro inesperado:', err);
  res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
});

// ─── EXPORT para Netlify Functions ────────────────────────────────────────────

export const handler = serverless(app);
export { app };
