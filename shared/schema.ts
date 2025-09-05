import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const projectStatusEnum = pgEnum("project_status", ["ongoing", "completed", "upcoming"]);
export const activityTypeEnum = pgEnum("activity_type", ["workshop", "hackathon", "formation"]);
export const participationStatusEnum = pgEnum("participation_status", ["registered", "attended", "cancelled"]);
export const donationTypeEnum = pgEnum("donation_type", ["financier", "technique", "matériel"]);
export const requestTypeEnum = pgEnum("request_type", ["room", "mentorship"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  domain: varchar("domain", { length: 100 }).notNull(),
  status: projectStatusEnum("status").notNull().default("upcoming"),
  participants: integer("participants").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Activities table
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  type: activityTypeEnum("type").notNull(),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  capacity: integer("capacity").notNull(),
  registeredCount: integer("registered_count").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Participations table
export const participations = pgTable("participations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  activityId: varchar("activity_id").notNull().references(() => activities.id),
  status: participationStatusEnum("status").notNull().default("registered"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Donations table
export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  type: donationTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Space requests table
export const spaceRequests = pgTable("space_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  type: requestTypeEnum("type").notNull(),
  details: text("details").notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  registeredCount: true,
  createdAt: true
});

export const insertParticipationSchema = createInsertSchema(participations).omit({
  id: true,
  createdAt: true
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true
});

export const insertSpaceRequestSchema = createInsertSchema(spaceRequests).omit({
  id: true,
  createdAt: true
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
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
