import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import bcrypt from 'bcryptjs';
// Conexão Neon via HTTP — compatível com ambientes serverless (Netlify Functions)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

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

// ─── READ ─────────────────────────────────────────────────────────────────────

export async function getTechnicalSupportRequests(limit = 50, offset = 0) {
  return db
    .select()
    .from(schema.technicalSupportRequests)
    .limit(limit)
    .offset(offset);
}

export async function getEquipmentSalesRequests(limit = 50, offset = 0) {
  return db
    .select()
    .from(schema.equipmentSalesRequests)
    .limit(limit)
    .offset(offset);
}

export async function getConsultingRequests(limit = 50, offset = 0) {
  return db
    .select()
    .from(schema.consultingRequests)
    .limit(limit)
    .offset(offset);
}

export async function getContactMessages(limit = 50, offset = 0) {
  return db
    .select()
    .from(schema.contactMessages)
    .limit(limit)
    .offset(offset);
}

export async function getItProjectRequests(limit = 50, offset = 0) {
  return db
    .select()
    .from(schema.itProjectsRequests)
    .limit(limit)
    .offset(offset);
}

export async function getItManagementRequests(limit = 50, offset = 0) {
  return db
    .select()
    .from(schema.itManagementRequests)
    .limit(limit)
    .offset(offset);
}

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────

export async function updateTechnicalSupportRequestStatus(
  id: number,
  status: string
) {
  return db
    .update(schema.technicalSupportRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.technicalSupportRequests.id, id));
}

export async function updateEquipmentSalesRequestStatus(
  id: number,
  status: string
) {
  return db
    .update(schema.equipmentSalesRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.equipmentSalesRequests.id, id));
}

export async function updateConsultingRequestStatus(
  id: number,
  status: string
) {
  return db
    .update(schema.consultingRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.consultingRequests.id, id));
}

export async function updateContactMessageStatus(id: number, status: string) {
  return db
    .update(schema.contactMessages)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.contactMessages.id, id));
}

export async function updateItProjectRequestStatus(
  id: number,
  status: string
) {
  return db
    .update(schema.itProjectsRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.itProjectsRequests.id, id));
}

export async function updateItManagementRequestStatus(
  id: number,
  status: string
) {
  return db
    .update(schema.itManagementRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.itManagementRequests.id, id));
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

export async function getUsers() {
  return db.select().from(schema.users);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}) {
  const passwordHash = await bcrypt.hash(data.password, 12);

  const result = await db
    .insert(schema.users)
    .values({
      openId: passwordHash.slice(0, 64), // compatibilidade de coluna
      name: data.name,
      email: data.email,
      loginMethod: 'password',
      role: data.role,
      passwordHash,
    })
    .returning();
  return result[0];
}

export async function deleteUser(id: number) {
  return db.delete(schema.users).where(eq(schema.users.id, id));
}

export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));
  return result[0] || null;
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<schema.User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;



  // Suporte a usuários antigos (hash SHA-256 no openId) e novos (bcrypt no passwordHash)
  if (user.passwordHash) {
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  // Fallback legacy: SHA-256 sem salt
  const { createHash } = await import('crypto');
  const legacyHash = createHash('sha256').update(password).digest('hex');
  return user.openId === legacyHash ? user : null;
}