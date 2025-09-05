import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  insertUserSchema,
  loginSchema,
  insertProjectSchema,
  insertActivitySchema,
  insertParticipationSchema,
  insertDonationSchema,
  insertSpaceRequestSchema,
  insertContactSchema,
  type User
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { status } = req.query;
      let projects;
      
      if (status && status !== 'all') {
        projects = await storage.getProjectsByStatus(status as string);
      } else {
        projects = await storage.getAllProjects();
      }
      
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/projects/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const updates = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/projects/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const { upcoming } = req.query;
      let activities;
      
      if (upcoming === 'true') {
        activities = await storage.getUpcomingActivities();
      } else {
        activities = await storage.getAllActivities();
      }
      
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/activities", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Activity registration
  app.post("/api/activities/:id/register", authenticateToken, async (req: any, res) => {
    try {
      const activityId = req.params.id;
      const userId = req.user.id;

      // Check if activity exists
      const activity = await storage.getActivity(activityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      // Check if already registered
      const existingParticipation = await storage.getParticipation(userId, activityId);
      if (existingParticipation) {
        return res.status(400).json({ message: "Already registered for this activity" });
      }

      // Check capacity
      if (activity.registeredCount >= activity.capacity) {
        return res.status(400).json({ message: "Activity is full" });
      }

      const participation = await storage.createParticipation({
        userId,
        activityId
      });

      res.status(201).json(participation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User participations
  app.get("/api/user/participations", authenticateToken, async (req: any, res) => {
    try {
      const participations = await storage.getUserParticipations(req.user.id);
      res.json(participations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Donations routes
  app.get("/api/donations", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const donations = await storage.getAllDonations();
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Space requests routes
  app.get("/api/space-requests", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const requests = await storage.getAllSpaceRequests();
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/space-requests", async (req, res) => {
    try {
      const requestData = insertSpaceRequestSchema.parse(req.body);
      const spaceRequest = await storage.createSpaceRequest(requestData);
      res.status(201).json(spaceRequest);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/space-requests/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { status } = req.body;
      const request = await storage.updateSpaceRequest(req.params.id, { status });
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Contacts routes
  app.get("/api/contacts", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stats endpoint for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      const activities = await storage.getAllActivities();
      const donations = await storage.getAllDonations();
      const users = await storage.getAllUsers();

      const stats = {
        projects: projects.length,
        beneficiaries: 5000, // Static for demo
        workshops: activities.filter(a => a.type === 'workshop').length,
        totalUsers: users.length,
        totalActivities: activities.length,
        totalDonations: donations.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0)
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
