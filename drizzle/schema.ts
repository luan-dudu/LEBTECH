import {
  integer,
  varchar,
  text,
  timestamp,
  pgEnum,
  pgTable,
  serial,
  boolean,
} from 'drizzle-orm/pg-core';

// ── Enums ──────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const supportStatusEnum = pgEnum('support_status', [
  'pending',
  'in_progress',
  'resolved',
  'closed',
]);
export const salesStatusEnum = pgEnum('sales_status', [
  'pending',
  'quoted',
  'negotiating',
  'closed',
]);
export const consultingStatusEnum = pgEnum('consulting_status', [
  'pending',
  'scheduled',
  'in_progress',
  'completed',
]);
export const contactStatusEnum = pgEnum('contact_status', [
  'new',
  'read',
  'responded',
  'closed',
]);
// Enums para tabelas que usavam varchar('status') livre
export const projectStatusEnum = pgEnum('project_status', [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);
export const managementStatusEnum = pgEnum('management_status', [
  'pending',
  'active',
  'paused',
  'cancelled',
]);

// ── users ──────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  openId: varchar('open_id', { length: 64 }).notNull().unique(),
  name: text('name'),
  email: varchar('email', { length: 320 }),
  loginMethod: varchar('login_method', { length: 64 }),
  role: userRoleEnum('role').notNull().default('user'),
  /** Hash bcrypt da senha (substitui o uso de openId como hash) */
  passwordHash: varchar('password_hash', { length: 255 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastSignedIn: timestamp('last_signed_in').notNull().defaultNow(),
});

// ── technical_support_requests ─────────────────────────────────────────────────

export const technicalSupportRequests = pgTable('technical_support_requests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  problemType: varchar('problem_type', { length: 50 }).notNull(),
  urgency: varchar('urgency', { length: 50 }).notNull(),
  description: text('description').notNull(),
  adminNotes: text('admin_notes'),
  status: supportStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── equipment_sales_requests ───────────────────────────────────────────────────

export const equipmentSalesRequests = pgTable('equipment_sales_requests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  equipmentType: varchar('equipment_type', { length: 100 }).notNull(),
  quantity: integer('quantity').notNull(),
  specifications: text('specifications').notNull(),
  budget: varchar('budget', { length: 100 }),
  timeline: varchar('timeline', { length: 50 }).notNull(),
  adminNotes: text('admin_notes'),
  status: salesStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── consulting_requests ────────────────────────────────────────────────────────

export const consultingRequests = pgTable('consulting_requests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  consultingType: varchar('consulting_type', { length: 100 }).notNull(),
  currentChallenges: text('current_challenges').notNull(),
  objectives: text('objectives').notNull(),
  teamSize: varchar('team_size', { length: 50 }),
  budget: varchar('budget', { length: 100 }),
  adminNotes: text('admin_notes'),
  status: consultingStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── contact_messages ───────────────────────────────────────────────────────────

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  adminNotes: text('admin_notes'),
  status: contactStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── it_projects_requests ───────────────────────────────────────────────────────

export const itProjectsRequests = pgTable('it_projects_requests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  company: varchar('company', { length: 255 }),
  projectType: varchar('project_type', { length: 100 }).notNull(),
  timeline: varchar('timeline', { length: 50 }).notNull(),
  budget: varchar('budget', { length: 50 }).notNull(),
  description: text('description').notNull(),
  adminNotes: text('admin_notes'),
  status: projectStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── it_management_requests ─────────────────────────────────────────────────────

export const itManagementRequests = pgTable('it_management_requests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  company: varchar('company', { length: 255 }),
  managementType: varchar('management_type', { length: 100 }).notNull(),
  userCount: varchar('user_count', { length: 50 }).notNull(),
  infrastructure: varchar('infrastructure', { length: 50 }).notNull(),
  challenges: text('challenges').notNull(),
  adminNotes: text('admin_notes'),
  status: managementStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Type exports ───────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type TechnicalSupportRequest = typeof technicalSupportRequests.$inferSelect;
export type EquipmentSalesRequest = typeof equipmentSalesRequests.$inferSelect;
export type ConsultingRequest = typeof consultingRequests.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type ItProjectRequest = typeof itProjectsRequests.$inferSelect;
export type ItManagementRequest = typeof itManagementRequests.$inferSelect;

// Insert types
export type NewUser = typeof users.$inferInsert;
export type NewTechnicalSupportRequest = typeof technicalSupportRequests.$inferInsert;
export type NewEquipmentSalesRequest = typeof equipmentSalesRequests.$inferInsert;
export type NewConsultingRequest = typeof consultingRequests.$inferInsert;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type NewItProjectRequest = typeof itProjectsRequests.$inferInsert;
export type NewItManagementRequest = typeof itManagementRequests.$inferInsert;