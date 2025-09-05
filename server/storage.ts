import { 
  type User, type InsertUser,
  type Project, type InsertProject,
  type Activity, type InsertActivity,
  type Participation, type InsertParticipation,
  type Donation, type InsertDonation,
  type SpaceRequest, type InsertSpaceRequest,
  type Contact, type InsertContact
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private activities: Map<string, Activity> = new Map();
  private participations: Map<string, Participation> = new Map();
  private donations: Map<string, Donation> = new Map();
  private spaceRequests: Map<string, SpaceRequest> = new Map();
  private contacts: Map<string, Contact> = new Map();

  constructor() {
    this.seedData();
  }

  private async seedData() {
    // Create admin user
    const adminId = randomUUID();
    const hashedPassword = await bcrypt.hash("admin123", 10);
    this.users.set(adminId, {
      id: adminId,
      name: "Admin User",
      email: "admin@intellcap.ma",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date()
    });

    // Add some sample projects
    const project1Id = randomUUID();
    this.projects.set(project1Id, {
      id: project1Id,
      title: "Plateforme E-learning",
      description: "Développement d'une plateforme d'apprentissage en ligne pour démocratiser l'accès à l'éducation technologique.",
      domain: "Tech",
      status: "ongoing",
      participants: 12,
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
      createdAt: new Date()
    });

    const project2Id = randomUUID();
    this.projects.set(project2Id, {
      id: project2Id,
      title: "App Micro-finance",
      description: "Application mobile pour faciliter l'accès au micro-crédit et aux services financiers pour les entrepreneurs.",
      domain: "Mobile",
      status: "upcoming",
      participants: 8,
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3",
      createdAt: new Date()
    });

    const project3Id = randomUUID();
    this.projects.set(project3Id, {
      id: project3Id,
      title: "Agriculture Intelligente",
      description: "Système IoT pour optimiser l'irrigation et le monitoring des cultures dans les exploitations agricoles locales.",
      domain: "IoT",
      status: "completed",
      participants: 15,
      imageUrl: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3",
      createdAt: new Date()
    });

    // Add some sample activities
    const activity1Id = randomUUID();
    this.activities.set(activity1Id, {
      id: activity1Id,
      title: "Hackathon Innovation 2024",
      description: "48 heures d'innovation intensive pour développer des solutions technologiques aux défis locaux.",
      type: "hackathon",
      date: new Date("2024-03-15T09:00:00Z"),
      location: "Centre Intellcap",
      capacity: 60,
      registeredCount: 45,
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3",
      createdAt: new Date()
    });

    const activity2Id = randomUUID();
    this.activities.set(activity2Id, {
      id: activity2Id,
      title: "Workshop React.js Avancé",
      description: "Maîtrisez les concepts avancés de React: hooks, context, performance optimization.",
      type: "workshop",
      date: new Date("2024-03-20T14:00:00Z"),
      location: "En ligne",
      capacity: 25,
      registeredCount: 18,
      imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3",
      createdAt: new Date()
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      role: "user",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.status === status);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id, createdAt: new Date() };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updated = { ...project, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Activities
  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getUpcomingActivities(): Promise<Activity[]> {
    const now = new Date();
    return Array.from(this.activities.values()).filter(activity => activity.date > now);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      registeredCount: 0,
      createdAt: new Date() 
    };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    const updated = { ...activity, ...updates };
    this.activities.set(id, updated);
    return updated;
  }

  async deleteActivity(id: string): Promise<boolean> {
    return this.activities.delete(id);
  }

  // Participations
  async getParticipation(userId: string, activityId: string): Promise<Participation | undefined> {
    return Array.from(this.participations.values()).find(
      p => p.userId === userId && p.activityId === activityId
    );
  }

  async getUserParticipations(userId: string): Promise<Participation[]> {
    return Array.from(this.participations.values()).filter(p => p.userId === userId);
  }

  async getActivityParticipations(activityId: string): Promise<Participation[]> {
    return Array.from(this.participations.values()).filter(p => p.activityId === activityId);
  }

  async createParticipation(insertParticipation: InsertParticipation): Promise<Participation> {
    const id = randomUUID();
    const participation: Participation = { 
      ...insertParticipation, 
      id, 
      status: "registered",
      createdAt: new Date() 
    };
    this.participations.set(id, participation);
    
    // Update activity registered count
    const activity = await this.getActivity(insertParticipation.activityId);
    if (activity) {
      await this.updateActivity(activity.id, { 
        registeredCount: activity.registeredCount + 1 
      });
    }
    
    return participation;
  }

  async updateParticipation(id: string, updates: Partial<Participation>): Promise<Participation | undefined> {
    const participation = this.participations.get(id);
    if (!participation) return undefined;
    const updated = { ...participation, ...updates };
    this.participations.set(id, updated);
    return updated;
  }

  async deleteParticipation(id: string): Promise<boolean> {
    return this.participations.delete(id);
  }

  // Donations
  async getDonation(id: string): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getAllDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = { ...insertDonation, id, createdAt: new Date() };
    this.donations.set(id, donation);
    return donation;
  }

  // Space Requests
  async getSpaceRequest(id: string): Promise<SpaceRequest | undefined> {
    return this.spaceRequests.get(id);
  }

  async getAllSpaceRequests(): Promise<SpaceRequest[]> {
    return Array.from(this.spaceRequests.values());
  }

  async createSpaceRequest(insertRequest: InsertSpaceRequest): Promise<SpaceRequest> {
    const id = randomUUID();
    const request: SpaceRequest = { ...insertRequest, id, createdAt: new Date() };
    this.spaceRequests.set(id, request);
    return request;
  }

  async updateSpaceRequest(id: string, updates: Partial<SpaceRequest>): Promise<SpaceRequest | undefined> {
    const request = this.spaceRequests.get(id);
    if (!request) return undefined;
    const updated = { ...request, ...updates };
    this.spaceRequests.set(id, updated);
    return updated;
  }

  // Contacts
  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { ...insertContact, id, createdAt: new Date() };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
