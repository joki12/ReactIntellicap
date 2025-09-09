import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
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

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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

  // Admin registration (for initial setup or by existing admins)
  app.post("/api/auth/register-admin", async (req, res) => {
    try {
      const { email, password, name, adminCode } = req.body;
      
      // Check for admin setup code (you can change this)
      const ADMIN_SETUP_CODE = process.env.ADMIN_SETUP_CODE || "BELGHIRIA";
      
      if (adminCode !== ADMIN_SETUP_CODE) {
        return res.status(403).json({ message: "Invalid admin setup code" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create admin user
      const user = await storage.createUser({
        name,
        email,
        password,
        role: "admin"
      });
      
      const { password: _, ...userWithoutPassword } = user;
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

  // Update user profile
  app.put("/api/auth/profile", authenticateToken, async (req: any, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;

      // Check if email is already taken by another user
      if (email && email !== req.user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }

      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;

      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Change password
  app.put("/api/auth/password", authenticateToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Verify current password
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      const updatedUser = await storage.updateUser(userId, { password: hashedPassword });
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update password" });
      }

      res.json({ message: "Password updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
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

  // Project registration
  app.post("/api/projects/:id/register", authenticateToken, async (req: any, res) => {
    try {
      const projectId = req.params.id;
      const userId = req.user.id;

      // Check if project exists
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if project is completed
      if (project.status === 'completed') {
        return res.status(400).json({ message: "Cannot register for a completed project" });
      }

      // Check if project is upcoming (only allow registration for ongoing projects)
      if (project.status !== 'ongoing') {
        return res.status(400).json({ message: "Project registration is not available at this time" });
      }

      // For now, we'll use a simple check based on participant count
      // TODO: Implement proper project participation tracking similar to activities
      // This is a temporary solution - ideally we'd have a project_participations table

      // Increment participant count
      const updatedProject = await storage.updateProject(projectId, {
        participants: project.participants + 1
      });

      if (!updatedProject) {
        return res.status(500).json({ message: "Failed to register for project" });
      }

      res.status(200).json({
        message: "Successfully registered for project",
        project: updatedProject
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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

      // Get all activities to join with participations
      const allActivities = await storage.getAllActivities();

      // Join participations with activity details
      const participationsWithActivities = participations.map(participation => {
        const activity = allActivities.find(a => a.id === participation.activityId);
        return {
          ...participation,
          activity: activity || null
        };
      });

      res.json(participationsWithActivities);
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

  // Promote user to admin
  app.post("/api/admin/users/:id/promote", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.updateUser(req.params.id, { role: "admin" });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json({ message: "User promoted to admin", user: userWithoutPassword });
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
        totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0).toString()
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User stats endpoint for dashboard
  app.get("/api/user/stats", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get user's participations
      const participations = await storage.getUserParticipations(userId);
      
      // Get user's completed projects (projects with status 'completed')
      const allProjects = await storage.getAllProjects();
      const userCompletedProjects = allProjects.filter(p => p.status === 'completed').length;
      
      // Calculate training time based on attended activities (assuming 2 hours per activity)
      // TODO: Make this configurable per activity type or add duration field to activities
      const attendedActivities = participations.filter(p => p.status === 'attended').length;
      const trainingHours = attendedActivities * 2;
      
      // Get user's donations
      const allDonations = await storage.getAllDonations();
      const userDonations = allDonations.filter(d => d.userId === userId);
      const totalDonated = userDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
      
      const userStats = {
        completedProjects: userCompletedProjects,
        trainingHours: trainingHours,
        totalDonated: totalDonated,
        activitiesJoined: participations.length,
        activitiesAttended: attendedActivities
      };

      res.json(userStats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await storage.getAllGalleryItems();
      res.json(galleryItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gallery", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const galleryData = req.body;
      const newItem = await storage.createGalleryItem(galleryData);
      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/gallery/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGalleryItem(id);
      if (deleted) {
        res.json({ message: "Gallery item deleted successfully" });
      } else {
        res.status(404).json({ message: "Gallery item not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Settings routes
  app.get("/api/settings", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/settings/:key", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { key } = req.params;
      const { value, description } = req.body;
      
      // Validate key is not null or empty
      if (!key || key === 'null' || key.trim() === '') {
        return res.status(400).json({ message: 'Invalid setting key' });
      }
      
      const setting = await storage.updateSetting(key, value, description);
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      if (setting) {
        res.json(setting);
      } else {
        res.status(404).json({ message: "Setting not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // File upload endpoint
  app.post("/api/upload", authenticateToken, upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Create URL for the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        message: 'File uploaded successfully',
        fileUrl: fileUrl,
        filename: req.file.filename
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });

  // Admin setup page
  app.get("/admin-setup", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Registration - React Intellicap</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #0056b3;
        }
        .message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <h2>Create Admin Account</h2>
    <form id="adminForm">
        <div class="form-group">
            <label for="name">Full Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
            <label for="adminCode">Admin Setup Code:</label>
            <input type="text" id="adminCode" name="adminCode" required placeholder="Enter admin code">
        </div>
        <button type="submit">Create Admin Account</button>
    </form>
    <div id="message"></div>

    <script>
        document.getElementById('adminForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                adminCode: formData.get('adminCode')
            };

            try {
                const response = await fetch('/api/auth/register-admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    document.getElementById('message').innerHTML =
                        '<div class="message success">Admin account created successfully! <a href="/">Click here to login</a></div>';
                    e.target.reset();
                } else {
                    document.getElementById('message').innerHTML =
                        '<div class="message error">Error: ' + result.message + '</div>';
                }
            } catch (error) {
                document.getElementById('message').innerHTML =
                    '<div class="message error">Network error: ' + error.message + '</div>';
            }
        });
    </script>
</body>
</html>`);
  });

  const httpServer = createServer(app);
  return httpServer;
}
