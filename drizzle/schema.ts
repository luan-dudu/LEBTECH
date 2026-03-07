import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela para solicitações de Assistência Técnica
export const technicalSupportRequests = mysqlTable("technical_support_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  problemType: varchar("problemType", { length: 50 }).notNull(), // hardware, software, network, security
  urgency: varchar("urgency", { length: 50 }).notNull(), // low, medium, high, critical
  description: text("description").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "resolved", "closed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TechnicalSupportRequest = typeof technicalSupportRequests.$inferSelect;
export type InsertTechnicalSupportRequest = typeof technicalSupportRequests.$inferInsert;

// Tabela para solicitações de Venda de Equipamentos
export const equipmentSalesRequests = mysqlTable("equipment_sales_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  equipmentType: varchar("equipmentType", { length: 100 }).notNull(),
  quantity: int("quantity").notNull(),
  specifications: text("specifications").notNull(),
  budget: varchar("budget", { length: 100 }),
  timeline: varchar("timeline", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["pending", "quoted", "negotiating", "closed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EquipmentSalesRequest = typeof equipmentSalesRequests.$inferSelect;
export type InsertEquipmentSalesRequest = typeof equipmentSalesRequests.$inferInsert;

// Tabela para solicitações de Consultoria de TI
export const consultingRequests = mysqlTable("consulting_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  consultingType: varchar("consultingType", { length: 100 }).notNull(),
  currentChallenges: text("currentChallenges").notNull(),
  objectives: text("objectives").notNull(),
  teamSize: varchar("teamSize", { length: 50 }),
  budget: varchar("budget", { length: 100 }),
  status: mysqlEnum("status", ["pending", "scheduled", "in_progress", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConsultingRequest = typeof consultingRequests.$inferSelect;
export type InsertConsultingRequest = typeof consultingRequests.$inferInsert;

// Tabela para mensagens de contato geral
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;