import { int, varchar, text, timestamp, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';

// Users table for authentication
export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  openId: varchar({ length: 64 }).notNull().unique(),
  name: text(),
  email: varchar({ length: 320 }),
  loginMethod: varchar({ length: 64 }),
  role: mysqlEnum(['user', 'admin']).notNull().default('user'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
  lastSignedIn: timestamp().notNull().defaultNow(),
});

// Technical Support Requests
export const technicalSupportRequests = mysqlTable('technical_support_requests', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 320 }).notNull(),
  phone: varchar({ length: 20 }).notNull(),
  company: varchar({ length: 255 }).notNull(),
  problemType: varchar({ length: 50 }).notNull(),
  urgency: varchar({ length: 50 }).notNull(),
  description: text().notNull(),
  status: mysqlEnum(['pending', 'in_progress', 'resolved', 'closed']).notNull().default('pending'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
});

// Equipment Sales Requests
export const equipmentSalesRequests = mysqlTable('equipment_sales_requests', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 320 }).notNull(),
  phone: varchar({ length: 20 }).notNull(),
  company: varchar({ length: 255 }).notNull(),
  equipmentType: varchar({ length: 100 }).notNull(),
  quantity: int().notNull(),
  specifications: text().notNull(),
  budget: varchar({ length: 100 }),
  timeline: varchar({ length: 50 }).notNull(),
  status: mysqlEnum(['pending', 'quoted', 'negotiating', 'closed']).notNull().default('pending'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
});

// Consulting Requests
export const consultingRequests = mysqlTable('consulting_requests', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 320 }).notNull(),
  phone: varchar({ length: 20 }).notNull(),
  company: varchar({ length: 255 }).notNull(),
  consultingType: varchar({ length: 100 }).notNull(),
  currentChallenges: text().notNull(),
  objectives: text().notNull(),
  teamSize: varchar({ length: 50 }),
  budget: varchar({ length: 100 }),
  status: mysqlEnum(['pending', 'scheduled', 'in_progress', 'completed']).notNull().default('pending'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
});

// Contact Messages
export const contactMessages = mysqlTable('contact_messages', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 320 }).notNull(),
  phone: varchar({ length: 20 }),
  subject: varchar({ length: 255 }).notNull(),
  message: text().notNull(),
  status: mysqlEnum(['new', 'read', 'responded', 'closed']).notNull().default('new'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
});

export type User = typeof users.$inferSelect;
export type TechnicalSupportRequest = typeof technicalSupportRequests.$inferSelect;
export type EquipmentSalesRequest = typeof equipmentSalesRequests.$inferSelect;
export type ConsultingRequest = typeof consultingRequests.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
