import {
  type User, type InsertUser,
  type Project, type InsertProject,
  type Activity, type InsertActivity,
  type Participation, type InsertParticipation,
  type Donation, type InsertDonation,
  type SpaceRequest, type InsertSpaceRequest,
  type Contact, type InsertContact,
  type Gallery, type InsertGallery,
  type Setting, type InsertSetting
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, gt, and, sql } from "drizzle-orm";
import {
  users,
  projects,
  activities,
  participations,
  donations,
  spaceRequests,
  contacts,
  gallery,
  settings
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Activities
  getActivity(id: string): Promise<Activity | undefined>;
  getAllActivities(): Promise<Activity[]>;
  getUpcomingActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined>;
  deleteActivity(id: string): Promise<boolean>;

  // Participations
  getParticipation(userId: string, activityId: string): Promise<Participation | undefined>;
  getUserParticipations(userId: string): Promise<Participation[]>;
  getActivityParticipations(activityId: string): Promise<Participation[]>;
  createParticipation(participation: InsertParticipation): Promise<Participation>;
  updateParticipation(id: string, updates: Partial<Participation>): Promise<Participation | undefined>;
  deleteParticipation(id: string): Promise<boolean>;

  // Donations
  getDonation(id: string): Promise<Donation | undefined>;
  getAllDonations(): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Space Requests
  getSpaceRequest(id: string): Promise<SpaceRequest | undefined>;
  getAllSpaceRequests(): Promise<SpaceRequest[]>;
  createSpaceRequest(request: InsertSpaceRequest): Promise<SpaceRequest>;
  updateSpaceRequest(id: string, updates: Partial<SpaceRequest>): Promise<SpaceRequest | undefined>;

  // Contacts
  getContact(id: string): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;

  // Gallery
  getGalleryItem(id: string): Promise<Gallery | undefined>;
  getAllGalleryItems(): Promise<Gallery[]>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  deleteGalleryItem(id: string): Promise<boolean>;

  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  getAllSettings(): Promise<Setting[]>;
  updateSetting(key: string, value: string, description?: string): Promise<Setting>;
}

export class DrizzleStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private sqlite: Database.Database;

  constructor() {
    this.sqlite = new Database("./sqlite.db");
    this.db = drizzle(this.sqlite);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser & { role?: "user" | "admin" }): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const userData = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      password: hashedPassword,
      role: insertUser.role || "user" as const,
      createdAt: new Date()
    };

    await this.db.insert(users).values(userData);
    return userData;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await this.db.update(users).set(updates).where(eq(users.id, id));
    return this.getUser(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return result.changes > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.select().from(users);
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getAllProjects(): Promise<Project[]> {
    return this.db.select().from(projects);
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return this.db.select().from(projects).where(sql`${projects.status} = ${status}`);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const projectData = {
      ...insertProject,
      id,
      createdAt: new Date(),
      imageUrl: insertProject.imageUrl || null
    };

    await this.db.insert(projects).values(projectData);
    return projectData;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    await this.db.update(projects).set(updates).where(eq(projects.id, id));
    return this.getProject(id);
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await this.db.delete(projects).where(eq(projects.id, id));
    return result.changes > 0;
  }

  // Activities
  async getActivity(id: string): Promise<Activity | undefined> {
    const result = await this.db.select().from(activities).where(eq(activities.id, id)).limit(1);
    return result[0];
  }

  async getAllActivities(): Promise<Activity[]> {
    return this.db.select().from(activities);
  }

  async getUpcomingActivities(): Promise<Activity[]> {
    const now = new Date();
    return this.db.select().from(activities).where(gt(activities.date, now));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activityData = {
      ...insertActivity,
      id,
      registeredCount: 0,
      createdAt: new Date(),
      imageUrl: insertActivity.imageUrl || null
    };

    await this.db.insert(activities).values(activityData);
    return activityData;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    await this.db.update(activities).set(updates).where(eq(activities.id, id));
    return this.getActivity(id);
  }

  async deleteActivity(id: string): Promise<boolean> {
    const result = await this.db.delete(activities).where(eq(activities.id, id));
    return result.changes > 0;
  }

  // Participations
  async getParticipation(userId: string, activityId: string): Promise<Participation | undefined> {
    const result = await this.db.select().from(participations)
      .where(and(eq(participations.userId, userId), eq(participations.activityId, activityId)))
      .limit(1);
    return result[0];
  }

  async getUserParticipations(userId: string): Promise<Participation[]> {
    return this.db.select().from(participations).where(eq(participations.userId, userId));
  }

  async getActivityParticipations(activityId: string): Promise<Participation[]> {
    return this.db.select().from(participations).where(eq(participations.activityId, activityId));
  }

  async createParticipation(insertParticipation: InsertParticipation): Promise<Participation> {
    const id = randomUUID();
    const participationData = {
      ...insertParticipation,
      id,
      status: "registered" as const,
      createdAt: new Date()
    };

    await this.db.insert(participations).values(participationData);

    // Update activity registered count
    await this.db.update(activities)
      .set({ registeredCount: sql`${activities.registeredCount} + 1` })
      .where(eq(activities.id, insertParticipation.activityId));

    return participationData;
  }

  async updateParticipation(id: string, updates: Partial<Participation>): Promise<Participation | undefined> {
    await this.db.update(participations).set(updates).where(eq(participations.id, id));
    const result = await this.db.select().from(participations).where(eq(participations.id, id)).limit(1);
    return result[0];
  }

  async deleteParticipation(id: string): Promise<boolean> {
    const result = await this.db.delete(participations).where(eq(participations.id, id));
    return result.changes > 0;
  }

  // Donations
  async getDonation(id: string): Promise<Donation | undefined> {
    const result = await this.db.select().from(donations).where(eq(donations.id, id)).limit(1);
    return result[0];
  }

  async getAllDonations(): Promise<Donation[]> {
    return this.db.select().from(donations);
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donationData = {
      ...insertDonation,
      id,
      createdAt: new Date(),
      userId: insertDonation.userId || null,
      amount: insertDonation.amount ? parseFloat(insertDonation.amount) : null,
      description: insertDonation.description || null
    };

    await this.db.insert(donations).values(donationData);
    return donationData;
  }

  // Space Requests
  async getSpaceRequest(id: string): Promise<SpaceRequest | undefined> {
    const result = await this.db.select().from(spaceRequests).where(eq(spaceRequests.id, id)).limit(1);
    return result[0];
  }

  async getAllSpaceRequests(): Promise<SpaceRequest[]> {
    return this.db.select().from(spaceRequests);
  }

  async createSpaceRequest(insertRequest: InsertSpaceRequest): Promise<SpaceRequest> {
    const id = randomUUID();
    const requestData = {
      ...insertRequest,
      id,
      createdAt: new Date(),
      userId: insertRequest.userId || null
    };

    await this.db.insert(spaceRequests).values(requestData);
    return requestData;
  }

  async updateSpaceRequest(id: string, updates: Partial<SpaceRequest>): Promise<SpaceRequest | undefined> {
    await this.db.update(spaceRequests).set(updates).where(eq(spaceRequests.id, id));
    return this.getSpaceRequest(id);
  }

  // Contacts
  async getContact(id: string): Promise<Contact | undefined> {
    const result = await this.db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return this.db.select().from(contacts);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contactData = {
      ...insertContact,
      id,
      createdAt: new Date()
    };

    await this.db.insert(contacts).values(contactData);
    return contactData;
  }

  // Gallery
  async getGalleryItem(id: string): Promise<Gallery | undefined> {
    const result = await this.db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
    return result[0];
  }

  async getAllGalleryItems(): Promise<Gallery[]> {
    return this.db.select().from(gallery);
  }

  async createGalleryItem(insertGallery: InsertGallery): Promise<Gallery> {
    const id = randomUUID();
    const galleryData = {
      ...insertGallery,
      id,
      createdAt: new Date(),
      description: insertGallery.description || null,
      category: insertGallery.category || null
    };

    await this.db.insert(gallery).values(galleryData);
    return galleryData;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const result = await this.db.delete(gallery).where(eq(gallery.id, id));
    return result.changes > 0;
  }

  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await this.db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return result[0];
  }

  async getAllSettings(): Promise<Setting[]> {
    return this.db.select().from(settings);
  }

  async updateSetting(key: string, value: string, description?: string): Promise<Setting> {
    // Validate key
    if (!key || key.trim() === '' || key === 'null') {
      throw new Error('Invalid setting key');
    }

    const existing = await this.getSetting(key);
    const now = new Date();

    if (existing) {
      // Update existing setting
      await this.db.update(settings)
        .set({ value, description: description || null, updatedAt: now })
        .where(eq(settings.key, key));
      return { ...existing, value, description: description || null, updatedAt: now };
    } else {
      // Create new setting
      const id = randomUUID();
      const settingData = {
        id,
        key,
        value,
        description: description || null,
        createdAt: now,
        updatedAt: now
      };
      await this.db.insert(settings).values(settingData);
      return settingData;
    }
  }
}

export const storage = new DrizzleStorage();
