import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, technicalSupportRequests, InsertTechnicalSupportRequest, equipmentSalesRequests, InsertEquipmentSalesRequest, consultingRequests, InsertConsultingRequest, contactMessages, InsertContactMessage } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Helpers para Assistência Técnica
export async function createTechnicalSupportRequest(data: InsertTechnicalSupportRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(technicalSupportRequests).values(data);
  return result;
}

export async function getTechnicalSupportRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(technicalSupportRequests).orderBy(desc(technicalSupportRequests.createdAt));
}

// Helpers para Venda de Equipamentos
export async function createEquipmentSalesRequest(data: InsertEquipmentSalesRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(equipmentSalesRequests).values(data);
  return result;
}

export async function getEquipmentSalesRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(equipmentSalesRequests).orderBy(desc(equipmentSalesRequests.createdAt));
}

// Helpers para Consultoria
export async function createConsultingRequest(data: InsertConsultingRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(consultingRequests).values(data);
  return result;
}

export async function getConsultingRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(consultingRequests).orderBy(desc(consultingRequests.createdAt));
}

// Helpers para Mensagens de Contato
export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contactMessages).values(data);
  return result;
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
