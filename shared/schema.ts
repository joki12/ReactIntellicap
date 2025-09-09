import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { z } from "zod";

// Enums (using text fields for SQLite)
const roleEnumValues = ["user", "admin"] as const;
const projectStatusEnumValues = ["ongoing", "completed", "upcoming"] as const;
const activityTypeEnumValues = ["workshop", "hackathon", "formation"] as const;
const participationStatusEnumValues = ["registered", "attended", "cancelled"] as const;
const donationTypeEnumValues = ["financier", "technique", "matériel"] as const;
const requestTypeEnumValues = ["room", "mentorship"] as const;
const requestStatusEnumValues = ["pending", "approved", "rejected"] as const;

// Users table
export const users = sqliteTable("users", {
  id: text("id", { length: 36 }).primaryKey(),
  name: text("name", { length: 100 }).notNull(),
  email: text("email", { length: 150 }).notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: roleEnumValues }).notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Projects table
export const projects = sqliteTable("projects", {
  id: text("id", { length: 36 }).primaryKey(),
  title: text("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  domain: text("domain", { length: 100 }).notNull(),
  status: text("status", { enum: projectStatusEnumValues }).notNull().default("upcoming"),
  participants: integer("participants").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Activities table
export const activities = sqliteTable("activities", {
  id: text("id", { length: 36 }).primaryKey(),
  title: text("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: activityTypeEnumValues }).notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  location: text("location", { length: 200 }).notNull(),
  capacity: integer("capacity").notNull(),
  registeredCount: integer("registered_count").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Participations table
export const participations = sqliteTable("participations", {
  id: text("id", { length: 36 }).primaryKey(),
  userId: text("user_id", { length: 36 }).notNull(),
  activityId: text("activity_id", { length: 36 }).notNull(),
  status: text("status", { enum: participationStatusEnumValues }).notNull().default("registered"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Donations table
export const donations = sqliteTable("donations", {
  id: text("id", { length: 36 }).primaryKey(),
  userId: text("user_id", { length: 36 }),
  name: text("name", { length: 100 }).notNull(),
  email: text("email", { length: 150 }).notNull(),
  type: text("type", { enum: donationTypeEnumValues }).notNull(),
  amount: real("amount"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Space requests table
export const spaceRequests = sqliteTable("space_requests", {
  id: text("id", { length: 36 }).primaryKey(),
  userId: text("user_id", { length: 36 }),
  name: text("name", { length: 100 }).notNull(),
  email: text("email", { length: 150 }).notNull(),
  type: text("type", { enum: requestTypeEnumValues }).notNull(),
  details: text("details").notNull(),
  status: text("status", { enum: requestStatusEnumValues }).notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Contacts table
export const contacts = sqliteTable("contacts", {
  id: text("id", { length: 36 }).primaryKey(),
  name: text("name", { length: 100 }).notNull(),
  email: text("email", { length: 150 }).notNull(),
  subject: text("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Gallery table
export const gallery = sqliteTable("gallery", {
  id: text("id", { length: 36 }).primaryKey(),
  title: text("title", { length: 150 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category", { length: 100 }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Settings table for configuration
export const settings = sqliteTable("settings", {
  id: text("id", { length: 36 }).primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`)
});

// Zod enums for validation
export const projectStatusZod = z.enum(["ongoing", "completed", "upcoming"]);
export const activityTypeZod = z.enum(["workshop", "hackathon", "formation"]);
export const donationTypeZod = z.enum(["financier", "technique", "matériel"]);
export const requestTypeZod = z.enum(["room", "mentorship"]);
export const requestStatusZod = z.enum(["pending", "approved", "rejected"]);

// Insert schemas - using manual Zod schemas to avoid Drizzle type issues
export const insertUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  password: z.string().min(6)
});

export const insertProjectSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1),
  domain: z.string().min(1).max(100),
  status: projectStatusZod.optional().default("upcoming"),
  participants: z.number().int().min(0).optional().default(0),
  imageUrl: z.string().optional()
});

export const insertActivitySchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1),
  type: activityTypeZod,
  date: z.union([z.date(), z.string()]).transform((val) => {
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  location: z.string().min(1).max(200),
  capacity: z.number().int().min(1),
  imageUrl: z.string().optional()
});

export const insertParticipationSchema = z.object({
  userId: z.string().min(1),
  activityId: z.string().min(1)
});

export const insertDonationSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  type: donationTypeZod,
  amount: z.string().optional(),
  description: z.string().optional(),
  technicalType: z.string().optional(),
  materialDetails: z.string().optional()
});

export const insertSpaceRequestSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  type: requestTypeZod,
  details: z.string().min(1),
  status: requestStatusZod.optional().default("pending")
});

export const insertContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  subject: z.string().min(1).max(200),
  message: z.string().min(1)
});

export const insertGallerySchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  category: z.string().optional()
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Participation = typeof participations.$inferSelect;
export type InsertParticipation = z.infer<typeof insertParticipationSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type SpaceRequest = typeof spaceRequests.$inferSelect;
export type InsertSpaceRequest = z.infer<typeof insertSpaceRequestSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type Gallery = typeof gallery.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = {
  key: string;
  value: string;
  description?: string;
};
