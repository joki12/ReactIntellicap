import { storage } from "./storage.js";

async function verifyData() {
  console.log("🔍 Verifying test data in database...");

  try {
    const projects = await storage.getAllProjects();
    const activities = await storage.getAllActivities();

    console.log(`📊 Found ${projects.length} projects:`);
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title} (${project.status}) - ${project.participants} participants`);
    });

    console.log(`\n📅 Found ${activities.length} activities:`);
    activities.forEach((activity, index) => {
      console.log(`   ${index + 1}. ${activity.title} (${activity.type}) - ${new Date(activity.date).toLocaleDateString()}`);
    });

    if (projects.length === 5 && activities.length === 5) {
      console.log("✅ All test data created successfully!");
    } else {
      console.log("⚠️  Expected 5 projects and 5 activities, but found different counts");
    }

  } catch (error) {
    console.error("❌ Error verifying data:", error);
  }
}

verifyData().then(() => {
  console.log("🏁 Verification completed");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
