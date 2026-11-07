import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { desc, eq, sql } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import bcrypt from 'bcryptjs';

// Conexão Neon (HTTP) ou PostgreSQL Local (pg Pool) — inicializada sob demanda
let _db: any = null;
function getDbInstance() {
  if (!_db) {
    const url =
      process.env.DATABASE_URL ||
      (process.env.DB_HOST && process.env.DB_USER
        ? `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'leb_tech'}`
        : '');

    if (!url) {
      throw new Error('DATABASE_URL não configurada. Configure a variável DATABASE_URL (string de conexão Neon ou PostgreSQL) no painel de deploy (Netlify/Vercel) ou no arquivo .env local.');
    }

    if (url.includes('neon.tech')) {
      const client = neon(url);
      _db = drizzleNeon(client, { schema });
    } else {
      const pool = new pg.Pool({ connectionString: url });
      _db = drizzlePg(pool, { schema });
    }
  }
  return _db;
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getDbInstance();
    const value = instance[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

// ─── SCHEMA (auto-correção) ───────────────────────────────────────────────────
// Não há migrations Postgres versionadas: colunas/tabelas/valores novos do
// schema.ts são criados aqui. Uma única consulta de leitura por instância
// confere o que já existe; comandos de alteração só rodam quando falta algo.

const REQUEST_TABLES = [
  'technical_support_requests',
  'equipment_sales_requests',
  'consulting_requests',
  'contact_messages',
  'it_projects_requests',
  'it_management_requests',
];

const PANEL_COLUMNS: Record<string, string> = {
  admin_notes: 'text',
  ai_proposal: 'text',
  ai_analysis: 'jsonb',
};

const EXTRA_COLUMNS: Record<string, Record<string, string>> = {
  contact_messages: { company: 'varchar(255)' },
};

// O painel admin usa pending/viewed/responded para todas as solicitações
const STATUS_ENUMS = [
  'support_status',
  'sales_status',
  'consulting_status',
  'contact_status',
  'project_status',
  'management_status',
];
const PANEL_STATUSES = ['pending', 'viewed', 'responded'];

const CREATE_LEB_IA_TICKETS = `CREATE TABLE IF NOT EXISTS leb_ia_tickets (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(320) NOT NULL,
  phone varchar(50),
  company varchar(255),
  city varchar(100),
  category varchar(100) NOT NULL,
  urgency varchar(50) NOT NULL,
  equipment varchar(255),
  summary text NOT NULL,
  symptoms text,
  steps_taken text,
  preliminary_diagnosis text,
  availability varchar(100),
  resolved_n1 boolean DEFAULT false,
  whatsapp_text text,
  status varchar(50) NOT NULL DEFAULT 'pending',
  ai_proposal text,
  ai_analysis jsonb,
  admin_notes text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
)`;

const sqlList = (values: string[]) => values.map((v) => `'${v}'`).join(', ');

async function findMissingSchemaStatements(): Promise<string[]> {
  const result = await db.execute(
    sql.raw(`
      SELECT 'column' AS kind, table_name AS name, column_name AS detail
        FROM information_schema.columns
       WHERE table_schema = current_schema()
         AND table_name IN (${sqlList([...REQUEST_TABLES, 'leb_ia_tickets'])})
      UNION ALL
      SELECT 'enum', t.typname, e.enumlabel
        FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
       WHERE t.typname IN (${sqlList(STATUS_ENUMS)})
    `)
  );
  const rows: { kind: string; name: string; detail: string }[] = result.rows ?? result;
  const columns = rows.filter((r) => r.kind === 'column');
  const enumValues = rows.filter((r) => r.kind === 'enum');

  const tables = new Set(columns.map((r) => r.name));
  const existingColumns = new Set(columns.map((r) => `${r.name}.${r.detail}`));
  const enums = new Set(enumValues.map((r) => r.name));
  const existingEnumValues = new Set(enumValues.map((r) => `${r.name}.${r.detail}`));

  const statements: string[] = [];
  for (const table of REQUEST_TABLES) {
    if (!tables.has(table)) continue; // tabelas base são criadas pelo drizzle-kit push
    const missing = Object.entries({ ...PANEL_COLUMNS, ...EXTRA_COLUMNS[table] }).filter(
      ([column]) => !existingColumns.has(`${table}.${column}`)
    );
    if (missing.length) {
      statements.push(
        `ALTER TABLE ${table} ${missing.map(([column, type]) => `ADD COLUMN IF NOT EXISTS ${column} ${type}`).join(', ')}`
      );
    }
  }
  if (!tables.has('leb_ia_tickets')) statements.push(CREATE_LEB_IA_TICKETS);
  for (const type of STATUS_ENUMS) {
    if (!enums.has(type)) continue;
    for (const value of PANEL_STATUSES) {
      if (!existingEnumValues.has(`${type}.${value}`)) {
        statements.push(`ALTER TYPE ${type} ADD VALUE IF NOT EXISTS '${value}'`);
      }
    }
  }
  return statements;
}

let _schemaReady: Promise<void> | null = null;
export function ensureSchema() {
  if (!_schemaReady) {
    _schemaReady = (async () => {
      for (const statement of await findMissingSchemaStatements()) {
        await db.execute(sql.raw(statement));
      }
    })().catch((err) => {
      _schemaReady = null; // tenta de novo na próxima requisição
      throw err;
    });
  }
  return _schemaReady;
}

// ─── STATUS ───────────────────────────────────────────────────────────────────

export type PanelStatus = 'pending' | 'viewed' | 'responded';

// Converte status antigos de cada tabela para os 3 status usados no painel
const LEGACY_STATUS: Record<string, PanelStatus> = {
  new: 'pending',
  read: 'viewed',
  in_progress: 'viewed',
  negotiating: 'viewed',
  active: 'viewed',
  paused: 'viewed',
  scheduled: 'responded',
  quoted: 'responded',
  resolved: 'responded',
  completed: 'responded',
  closed: 'responded',
  cancelled: 'responded',
};

export function isPanelStatus(status: unknown): status is PanelStatus {
  return status === 'pending' || status === 'viewed' || status === 'responded';
}

export function normalizeStatus(status: string | null | undefined): PanelStatus {
  if (isPanelStatus(status)) return status;
  return (status && LEGACY_STATUS[status]) || 'pending';
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createTechnicalSupportRequest(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  problemType: string;
  urgency: string;
  description: string;
}) {
  const result = await db
    .insert(schema.technicalSupportRequests)
    .values(data)
    .returning();
  return result[0];
}

export async function createEquipmentSalesRequest(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  equipmentType: string;
  quantity: number;
  specifications: string;
  budget?: string;
  timeline: string;
}) {
  const result = await db
    .insert(schema.equipmentSalesRequests)
    .values(data)
    .returning();
  return result[0];
}

export async function createConsultingRequest(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  consultingType: string;
  currentChallenges: string;
  objectives: string;
  teamSize?: string;
  budget?: string;
}) {
  const result = await db
    .insert(schema.consultingRequests)
    .values(data)
    .returning();
  return result[0];
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}) {
  const result = await db
    .insert(schema.contactMessages)
    .values(data)
    .returning();
  return result[0];
}

export async function createItProjectRequest(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  timeline: string;
  budget: string;
  description: string;
}) {
  const result = await db
    .insert(schema.itProjectsRequests)
    .values(data)
    .returning();
  return result[0];
}

export async function createItManagementRequest(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  managementType: string;
  userCount: string;
  infrastructure: string;
  challenges: string;
}) {
  const result = await db
    .insert(schema.itManagementRequests)
    .values(data)
    .returning();
  return result[0];
}

export async function createLebIaTicket(data: schema.NewLebIaTicket) {
  const result = await db
    .insert(schema.lebIaTickets)
    .values(data)
    .returning();
  return result[0];
}

// ─── READ ─────────────────────────────────────────────────────────────────────
// Sempre das mais novas para as mais antigas, para nenhuma solicitação recente
// ficar de fora do limite.

const LIST_LIMIT = 200;

export async function getTechnicalSupportRequests(limit = LIST_LIMIT, offset = 0) {
  return db
    .select()
    .from(schema.technicalSupportRequests)
    .orderBy(desc(schema.technicalSupportRequests.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getEquipmentSalesRequests(limit = LIST_LIMIT, offset = 0) {
  return db
    .select()
    .from(schema.equipmentSalesRequests)
    .orderBy(desc(schema.equipmentSalesRequests.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getConsultingRequests(limit = LIST_LIMIT, offset = 0) {
  return db
    .select()
    .from(schema.consultingRequests)
    .orderBy(desc(schema.consultingRequests.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getContactMessages(limit = LIST_LIMIT, offset = 0) {
  return db
    .select()
    .from(schema.contactMessages)
    .orderBy(desc(schema.contactMessages.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getItProjectRequests(limit = LIST_LIMIT, offset = 0) {
  return db
    .select()
    .from(schema.itProjectsRequests)
    .orderBy(desc(schema.itProjectsRequests.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getItManagementRequests(limit = LIST_LIMIT, offset = 0) {
  return db
    .select()
    .from(schema.itManagementRequests)
    .orderBy(desc(schema.itManagementRequests.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getLebIaTickets(limit = LIST_LIMIT, offset = 0) {
  return db
    .select()
    .from(schema.lebIaTickets)
    .orderBy(desc(schema.lebIaTickets.createdAt))
    .limit(limit)
    .offset(offset);
}

// ─── UPDATE (status, proposta e análise de IA) ───────────────────────────────

const SUBMISSION_TABLES = {
  'Assistência Técnica': schema.technicalSupportRequests,
  'Venda de Equipamentos': schema.equipmentSalesRequests,
  'Consultoria de TI': schema.consultingRequests,
  'Contato': schema.contactMessages,
  'Projetos de TI': schema.itProjectsRequests,
  'Gestão de TI': schema.itManagementRequests,
  'Atendimento LEB IA': schema.lebIaTickets,
};

export type SubmissionType = keyof typeof SUBMISSION_TABLES;

export function isSubmissionType(type: unknown): type is SubmissionType {
  return typeof type === 'string' && Object.hasOwn(SUBMISSION_TABLES, type);
}

/** Atualiza uma solicitação; retorna false se o registro não existe. */
async function updateSubmission(type: SubmissionType, id: number, values: Record<string, unknown>) {
  const table = SUBMISSION_TABLES[type];
  const updated = await db
    .update(table)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.id, id))
    .returning({ id: table.id });
  return updated.length > 0;
}

export function updateSubmissionStatus(type: SubmissionType, id: number, status: PanelStatus) {
  return updateSubmission(type, id, { status });
}

export function updateSubmissionAiProposal(type: SubmissionType, id: number, proposal: string) {
  return updateSubmission(type, id, { aiProposal: proposal });
}

export function updateSubmissionAiAnalysis(type: SubmissionType, id: number, analysis: unknown) {
  return updateSubmission(type, id, { aiAnalysis: analysis });
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteTechnicalSupportRequest(id: number) {
  return db
    .delete(schema.technicalSupportRequests)
    .where(eq(schema.technicalSupportRequests.id, id));
}

export async function deleteEquipmentSalesRequest(id: number) {
  return db
    .delete(schema.equipmentSalesRequests)
    .where(eq(schema.equipmentSalesRequests.id, id));
}

export async function deleteConsultingRequest(id: number) {
  return db
    .delete(schema.consultingRequests)
    .where(eq(schema.consultingRequests.id, id));
}

export async function deleteContactMessage(id: number) {
  return db
    .delete(schema.contactMessages)
    .where(eq(schema.contactMessages.id, id));
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'user';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function getUsers() {
  return db.select().from(schema.users).orderBy(schema.users.id);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const passwordHash = await bcrypt.hash(data.password, 12);

  const result = await db
    .insert(schema.users)
    .values({
      openId: passwordHash.slice(0, 64), // compatibilidade de coluna
      name: data.name,
      email: normalizeEmail(data.email),
      loginMethod: 'password',
      role: data.role,
      passwordHash,
    })
    .returning();
  return result[0];
}

/** Atualiza nome, e-mail, função e (opcionalmente) a senha; null se não existe. */
export async function updateUser(
  id: number,
  data: { name: string; email: string; role: UserRole; password?: string }
): Promise<schema.User | null> {
  const values: Partial<schema.NewUser> = {
    name: data.name,
    email: normalizeEmail(data.email),
    role: data.role,
    updatedAt: new Date(),
  };
  if (data.password) values.passwordHash = await bcrypt.hash(data.password, 12);

  const result = await db
    .update(schema.users)
    .set(values)
    .where(eq(schema.users.id, id))
    .returning();
  return result[0] || null;
}

/** Remove o usuário; retorna false se ele não existe. */
export async function deleteUser(id: number) {
  const deleted = await db
    .delete(schema.users)
    .where(eq(schema.users.id, id))
    .returning({ id: schema.users.id });
  return deleted.length > 0;
}

export async function findUserByEmail(email: string): Promise<schema.User | null> {
  const result = await db
    .select()
    .from(schema.users)
    .where(sql`lower(${schema.users.email}) = ${normalizeEmail(email)}`)
    .limit(1);
  return result[0] || null;
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<schema.User | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.isActive) return null;

  let valid: boolean;
  if (user.passwordHash) {
    valid = await bcrypt.compare(password, user.passwordHash);
  } else {
    // Fallback legacy: SHA-256 sem salt guardado no openId
    const { createHash } = await import('crypto');
    valid = user.openId === createHash('sha256').update(password).digest('hex');
  }
  if (!valid) return null;

  await db
    .update(schema.users)
    .set({ lastSignedIn: new Date() })
    .where(eq(schema.users.id, user.id))
    .catch((err: unknown) => console.error('[LEB DB] Falha ao registrar último acesso:', err));
  return user;
}
