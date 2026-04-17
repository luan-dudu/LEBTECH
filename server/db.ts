import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../drizzle/schema';

let db: ReturnType<typeof drizzle> | null = null;

async function getDb() {
  if (db) return db;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'leb_tech',
  });

  db = drizzle(connection, { schema });
  return db;
}

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
  const result = await db.insert(schema.technicalSupportRequests).values(data);
  return result;
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
  const result = await db.insert(schema.equipmentSalesRequests).values(data);
  return result;
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
  const result = await db.insert(schema.consultingRequests).values(data);
  return result;
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const db = await getDb();
  const result = await db.insert(schema.contactMessages).values(data);
  return result;
}

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

export async function updateTechnicalSupportRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db.update(schema.technicalSupportRequests).set({ status: status as any }).where({ id });
}

export async function updateEquipmentSalesRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db.update(schema.equipmentSalesRequests).set({ status: status as any }).where({ id });
}

export async function updateConsultingRequestStatus(id: number, status: string) {
  const db = await getDb();
  return db.update(schema.consultingRequests).set({ status: status as any }).where({ id });
}

export async function updateContactMessageStatus(id: number, status: string) {
  const db = await getDb();
  return db.update(schema.contactMessages).set({ status: status as any }).where({ id });
}

export async function deleteTechnicalSupportRequest(id: number) {
  const db = await getDb();
  return db.delete(schema.technicalSupportRequests).where({ id });
}

export async function deleteEquipmentSalesRequest(id: number) {
  const db = await getDb();
  return db.delete(schema.equipmentSalesRequests).where({ id });
}

export async function deleteConsultingRequest(id: number) {
  const db = await getDb();
  return db.delete(schema.consultingRequests).where({ id });
}

export async function deleteContactMessage(id: number) {
  const db = await getDb();
  return db.delete(schema.contactMessages).where({ id });
}
