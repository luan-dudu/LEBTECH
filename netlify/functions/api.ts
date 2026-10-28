import serverless from 'serverless-http';
import express from 'express';
import crypto from 'crypto';
import {
  createTechnicalSupportRequest,
  createConsultingRequest,
  createEquipmentSalesRequest,
  createContactMessage,
  createItProjectRequest,
  createItManagementRequest,
  getTechnicalSupportRequests,
  getEquipmentSalesRequests,
  getConsultingRequests,
  getContactMessages,
  getItProjectRequests,
  getItManagementRequests,
  updateTechnicalSupportRequestStatus,
  updateEquipmentSalesRequestStatus,
  updateConsultingRequestStatus,
  updateContactMessageStatus,
  updateItProjectRequestStatus,
  updateItManagementRequestStatus,
  getUsers,
  createUser,
  deleteUser,
  verifyUserPassword,
  getLebIaTickets,
  updateLebIaTicketStatus,
  updateSubmissionAiProposal,
  updateSubmissionAiAnalysis,
} from '../../server/db';
import { runAiChat, aiRateLimited, generateAiProposal, analyzeAiSubmission } from '../../server/ai';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── FORMULÁRIOS PÚBLICOS ─────────────────────────────────────────────────────

app.post('/api/support', async (req, res) => {
  try {
    const result = await createTechnicalSupportRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/consulting', async (req, res) => {
  try {
    const result = await createConsultingRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const result = await createEquipmentSalesRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const result = await createContactMessage(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const result = await createItProjectRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/management', async (req, res) => {
  try {
    const result = await createItManagementRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── LEB IA — ATENDIMENTO N1 ──────────────────────────────────────────────────

app.post('/api/ai/chat', async (req, res) => {
  try {
    const ip = String(req.headers['x-nf-client-connection-ip'] || req.headers['x-forwarded-for'] || req.ip || 'anon');
    if (aiRateLimited(ip)) {
      return res.status(429).json({ success: false, error: 'Muitas mensagens em pouco tempo. Aguarde alguns minutos.' });
    }
    const result = await runAiChat(req.body?.messages);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── ADMIN — LOGIN ────────────────────────────────────────────────────────────

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios.' });
    }

    const inputEmail = String(email).trim().toLowerCase();
    const adminEmailEnv = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const defaultEmails = ['admin@lebtech.com', 'admin@lebtech.com.br'];
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const isMatchAdminEmail = defaultEmails.includes(inputEmail) || (adminEmailEnv && inputEmail === adminEmailEnv);

    if (isMatchAdminEmail && String(password) === adminPassword) {
      const token = generateToken(email);
      return res.json({ success: true, token });
    }

    // Checar usuários cadastrados no banco
    const user = await verifyUserPassword(email, password).catch(() => null);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos!',
      });
    }

    const token = generateToken(user.email!);
    res.json({ success: true, token });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message || 'Erro ao realizar login.' });
  }
});

// ─── ADMIN — SUBMISSIONS ──────────────────────────────────────────────────────

app.get('/api/admin/submissions', async (_req, res) => {
  try {
    const [support, equipment, consulting, contact, projects, management, lebIa] =
      await Promise.all([
        getTechnicalSupportRequests(),
        getEquipmentSalesRequests(),
        getConsultingRequests(),
        getContactMessages(),
        getItProjectRequests(),
        getItManagementRequests(),
        getLebIaTickets(),
      ]);

    const all = [
      ...support.map((s) => ({
        id: s.id,
        type: 'Assistência Técnica',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company,
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.description,
        adminNotes: s.adminNotes,
        aiProposal: (s as any).aiProposal,
        aiAnalysis: (s as any).aiAnalysis,
      })),
      ...equipment.map((s) => ({
        id: s.id,
        type: 'Venda de Equipamentos',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company,
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.specifications,
        adminNotes: s.adminNotes,
        aiProposal: (s as any).aiProposal,
        aiAnalysis: (s as any).aiAnalysis,
      })),
      ...consulting.map((s) => ({
        id: s.id,
        type: 'Consultoria de TI',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company,
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.currentChallenges,
        adminNotes: s.adminNotes,
        aiProposal: (s as any).aiProposal,
        aiAnalysis: (s as any).aiAnalysis,
      })),
      ...contact.map((s) => ({
        id: s.id,
        type: 'Contato',
        name: s.name,
        email: s.email,
        phone: s.phone || '',
        company: '',
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.message,
        adminNotes: s.adminNotes,
        aiProposal: (s as any).aiProposal,
        aiAnalysis: (s as any).aiAnalysis,
      })),
      ...projects.map((s) => ({
        id: s.id,
        type: 'Projetos de TI',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company || '',
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.description,
        adminNotes: s.adminNotes,
        aiProposal: (s as any).aiProposal,
        aiAnalysis: (s as any).aiAnalysis,
      })),
      ...management.map((s) => ({
        id: s.id,
        type: 'Gestão de TI',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company || '',
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.challenges,
        adminNotes: s.adminNotes,
        aiProposal: (s as any).aiProposal,
        aiAnalysis: (s as any).aiAnalysis,
      })),
      ...lebIa.map((t) => ({
        id: t.id,
        type: 'Atendimento LEB IA',
        name: t.name,
        email: t.email,
        phone: t.phone || '',
        company: t.company || (t.city ? `Cidade: ${t.city}` : 'Cliente Particular'),
        status: t.status,
        createdAt: t.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: t.whatsappText || `[${t.category} - Urgência ${t.urgency}]\n${t.summary}\n${t.symptoms ? 'Sintomas: ' + t.symptoms : ''}`,
        adminNotes: t.adminNotes,
        aiProposal: (t as any).aiProposal,
        aiAnalysis: (t as any).aiAnalysis || {
          urgencia: t.urgency,
          categoriaSugerida: t.category,
          nivelComplexidade: t.resolvedN1 ? 'N1 - Suporte Básico' : 'N2 - Técnico Especializado',
          impactoNegocio: t.summary,
          tags: [t.category, `Urgência ${t.urgency}`, t.equipment || 'TI'].filter(Boolean).map(x => '#' + x.replace(/\s+/g, '')),
          acaoRecomendada: t.preliminaryDiagnosis || (t.resolvedN1 ? 'Resolvido no N1 via LEB IA. Acompanhar satisfação.' : 'Agendar visita ou atendimento remoto com técnico responsável.')
        },
        rawTicket: t,
      })),
    ].sort((a, b) =>
      (b.createdAt || '').localeCompare(a.createdAt || '')
    );

    res.json({ success: true, data: all });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/submissions/status', async (req, res) => {
  try {
    const { id, type, status } = req.body;

    if (type === 'Assistência Técnica')
      await updateTechnicalSupportRequestStatus(id, status);
    else if (type === 'Venda de Equipamentos')
      await updateEquipmentSalesRequestStatus(id, status);
    else if (type === 'Consultoria de TI')
      await updateConsultingRequestStatus(id, status);
    else if (type === 'Contato')
      await updateContactMessageStatus(id, status);
    else if (type === 'Projetos de TI')
      await updateItProjectRequestStatus(id, status);
    else if (type === 'Gestão de TI')
      await updateItManagementRequestStatus(id, status);
    else if (type === 'Atendimento LEB IA')
      await updateLebIaTicketStatus(id, status);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✨ Gerador Automático de Propostas com IA
app.post('/api/admin/ai/proposal', async (req, res) => {
  try {
    const { type, id, name, company, phone, email, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Nome e descrição são obrigatórios.' });
    }
    const proposal = await generateAiProposal({ type: type || 'Geral', name, company, phone, email, description });
    if (id && type) {
      await updateSubmissionAiProposal(type, Number(id), proposal);
    }
    res.json({ success: true, proposal });
  } catch (error: any) {
    console.error('[LEB IA] Erro ao gerar proposta:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎯 Triagem e Classificação Inteligente com IA
app.post('/api/admin/ai/analyze', async (req, res) => {
  try {
    const { type, id, name, company, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Nome e descrição são obrigatórios.' });
    }
    const analysis = await analyzeAiSubmission({ type: type || 'Geral', name, company, description });
    if (id && type) {
      await updateSubmissionAiAnalysis(type, Number(id), analysis);
    }
    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('[LEB IA] Erro ao analisar chamado:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Salvar proposta editada manualmente pelo admin
app.put('/api/admin/submissions/proposal', async (req, res) => {
  try {
    const { type, id, proposal } = req.body;
    if (!id || !type) {
      return res.status(400).json({ success: false, error: 'ID e tipo são obrigatórios.' });
    }
    await updateSubmissionAiProposal(type, Number(id), proposal);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── ADMIN — USERS ────────────────────────────────────────────────────────────

app.get('/api/admin/users', async (_req, res) => {
  try {
    const users = await getUsers();
    // Nunca retornar o hash de senha
    const safeUsers = users.map(({ passwordHash, openId, ...u }) => u);
    res.json({ success: true, data: safeUsers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/users', async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.cause ? error.cause.message : error.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await deleteUser(Number(req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── JWT HELPERS ──────────────────────────────────────────────────────────────

function generateToken(email: string): string {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  ).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'lebtech-jwt-secret-change-in-prod')
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

// ─── EXPORT para Netlify Functions ────────────────────────────────────────────

export const handler = serverless(app);
export { app };
