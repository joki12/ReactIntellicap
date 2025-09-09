import { storage } from "./storage.js";

async function clearDatabase() {
  console.log("🧹 Clearing existing data...");

  try {
    // Get all projects and activities to delete them
    const projects = await storage.getAllProjects();
    const activities = await storage.getAllActivities();

    console.log(`🗑️  Deleting ${projects.length} projects...`);
    for (const project of projects) {
      await storage.deleteProject(project.id);
    }

    console.log(`🗑️  Deleting ${activities.length} activities...`);
    for (const activity of activities) {
      await storage.deleteActivity(activity.id);
    }

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  }
}

async function seedDatabase() {
  console.log("🌱 Seeding database with test data...");

  try {
    // Check if data already exists
    const existingProjects = await storage.getAllProjects();
    const existingActivities = await storage.getAllActivities();

    if (existingProjects.length > 0 || existingActivities.length > 0) {
      console.log("⚠️  Existing data found. Clearing database first...");
      await clearDatabase();
    }

    // Create 5 test projects
    const projects = [
      {
        title: "AI-Powered Healthcare Assistant",
        description: "Developing an intelligent healthcare assistant using machine learning to help doctors diagnose and treat patients more effectively.",
        domain: "Healthcare & AI",
        status: "ongoing" as const,
        participants: 12,
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Smart City Infrastructure",
        description: "Building IoT-based smart city infrastructure to optimize traffic flow, waste management, and energy consumption.",
        domain: "IoT & Smart Cities",
        status: "ongoing" as const,
        participants: 8,
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Sustainable Agriculture Platform",
        description: "Creating a platform that uses data analytics and IoT sensors to help farmers optimize crop yields and reduce environmental impact.",
        domain: "Agriculture & Sustainability",
        status: "completed" as const,
        participants: 15,
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Educational VR Learning",
        description: "Developing virtual reality educational content to make learning more immersive and engaging for students.",
        domain: "Education & VR",
        status: "upcoming" as const,
        participants: 6,
        imageUrl: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Blockchain Supply Chain",
        description: "Implementing blockchain technology to create transparent and secure supply chain management systems.",
        domain: "Blockchain & Logistics",
        status: "ongoing" as const,
        participants: 10,
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      }
    ];

    console.log("📝 Creating projects...");
    for (const project of projects) {
      await storage.createProject(project);
      console.log(`✅ Created project: ${project.title}`);
    }

    // Create 5 test activities
    const activities = [
      {
        title: "React Advanced Workshop",
        description: "Deep dive into advanced React concepts including hooks, context, and performance optimization techniques.",
        type: "workshop" as const,
        date: new Date("2025-10-15T14:00:00"),
        location: "Casablanca Tech Hub, Salle A1",
        capacity: 25,
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "AI & Machine Learning Hackathon",
        description: "48-hour coding challenge focused on solving real-world problems using AI and machine learning technologies.",
        type: "hackathon" as const,
        date: new Date("2025-11-20T09:00:00"),
        location: "Université Hassan II, Amphithéâtre Principal",
        capacity: 50,
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Data Science Bootcamp",
        description: "Intensive 5-day training program covering Python, statistics, and machine learning fundamentals.",
        type: "formation" as const,
        date: new Date("2025-09-25T09:00:00"),
        location: "ENSIAS, Salle de Formation",
        capacity: 30,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "IoT Development Workshop",
        description: "Hands-on workshop teaching IoT device programming, sensor integration, and cloud connectivity.",
        type: "workshop" as const,
        date: new Date("2025-12-05T10:00:00"),
        location: "Technopark Casablanca, Lab IoT",
        capacity: 20,
        imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Startup Pitch Competition",
        description: "Annual competition where entrepreneurs pitch their innovative ideas to investors and industry experts.",
        type: "hackathon" as const,
        date: new Date("2025-10-30T18:00:00"),
        location: "Palais des Congrès, Grande Salle",
        capacity: 100,
        imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      }
    ];

    console.log("📅 Creating activities...");
    for (const activity of activities) {
      await storage.createActivity(activity);
      console.log(`✅ Created activity: ${activity.title}`);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - ${projects.length} projects created`);
    console.log(`   - ${activities.length} activities created`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("🏁 Seeding process finished");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
