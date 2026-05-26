import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema';

let db: ReturnType<typeof drizzle> | null = null;

async function getDb() {
  if (db) return db;

  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'leb_tech',
  });

  db = drizzle(pool, { schema });
  return db;
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
  const db = await getDb();
  const result = await db.insert(schema.technicalSupportRequests).values(data).returning();
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
  const db = await getDb();
  const result = await db.insert(schema.equipmentSalesRequests).values(data).returning();
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
  const db = await getDb();
  const result = await db.insert(schema.consultingRequests).values(data).returning();
  return result[0];
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const db = await getDb();
  const result = await db.insert(schema.contactMessages).values(data).returning();
  return result[0];
}

// ─── READ ─────────────────────────────────────────────────────────────────────

export async function getTechnicalSupportRequests(limit = 50, offset = 0) {
  const db = await getDb();
  return db.select().from(schema.technicalSupportRequests).limit(limit).offset(offset);
}

export async function getEquipmentSalesRequests(limit = 50, offset = 0) {
  const db = await getDb();
  return db.select().from(schema.equipmentSalesRequests).limit(limit).offset(offset);
}

export async function getConsultingRequests(limit = 50, offset = 0) {
  const db = await getDb();
  return db.select().from(schema.consultingRequests).limit(limit).offset(offset);
}

export async function getContactMessages(limit = 50, offset = 0) {
  const db = await getDb();
  return db.select().from(schema.contactMessages).limit(limit).offset(offset);
}

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────

export async function updateTechnicalSupportRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db
    .update(schema.technicalSupportRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.technicalSupportRequests.id, id));
}

export async function updateEquipmentSalesRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db
    .update(schema.equipmentSalesRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.equipmentSalesRequests.id, id));
}

export async function updateConsultingRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db
    .update(schema.consultingRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.consultingRequests.id, id));
}

export async function updateContactMessageStatus(id: number, status: string) {
  const db = await getDb();
  return db
    .update(schema.contactMessages)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(schema.contactMessages.id, id));
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteTechnicalSupportRequest(id: number) {
  const db = await getDb();
  return db
    .delete(schema.technicalSupportRequests)
    .where(eq(schema.technicalSupportRequests.id, id));
}

export async function deleteEquipmentSalesRequest(id: number) {
  const db = await getDb();
  return db
    .delete(schema.equipmentSalesRequests)
    .where(eq(schema.equipmentSalesRequests.id, id));
}

export async function deleteConsultingRequest(id: number) {
  const db = await getDb();
  return db
    .delete(schema.consultingRequests)
    .where(eq(schema.consultingRequests.id, id));
}

export async function deleteContactMessage(id: number) {
  const db = await getDb();
  return db
    .delete(schema.contactMessages)
    .where(eq(schema.contactMessages.id, id));
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
  const db = await getDb();
  const result = await db.insert(schema.itProjectsRequests).values(data).returning();
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
  const db = await getDb();
  const result = await db.insert(schema.itManagementRequests).values(data).returning();
  return result[0];
}

// No final do server/db.ts, adiciona:
export async function getItProjectRequests(limit = 50, offset = 0) {
  const db = await getDb();
  return db.select().from(schema.itProjectsRequests).limit(limit).offset(offset);
}

export async function getItManagementRequests(limit = 50, offset = 0) {
  const db = await getDb();
  return db.select().from(schema.itManagementRequests).limit(limit).offset(offset);
}

export async function updateItProjectRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db.update(schema.itProjectsRequests).set({ status, updatedAt: new Date() }).where(eq(schema.itProjectsRequests.id, id));
}

export async function updateItManagementRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db.update(schema.itManagementRequests).set({ status, updatedAt: new Date() }).where(eq(schema.itManagementRequests.id, id));
}

// ─── USERS ────────────────────────────────────────────────────────────────────
import crypto from 'crypto';

export async function getUsers() {
  const db = await getDb();
  return db.select().from(schema.users);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
}) {
  const db = await getDb();
  const crypto = await import('crypto');
  const passwordHash = crypto.createHash('sha256').update(data.password).digest('hex');
  const result = await db.insert(schema.users).values({
    openId: passwordHash,
    name: data.name,
    email: data.email,
    loginMethod: 'password',
    role: data.role === 'manager' ? 'user' : data.role as 'admin' | 'user',
  }).returning();
  return result[0];
}
export async function deleteUser(id: number) {
  const db = await getDb();
  return db.delete(schema.users).where(eq(schema.users.id, id));
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  const result = await db.select().from(schema.users).where(eq(schema.users.email, email));
  return result[0] || null;
}