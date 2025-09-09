import { storage } from "./server/storage";

async function initializeSettings() {
  try {
    // Initialize default RIB settings
    await storage.updateSetting("rib_number", "481450800070519711864874", "Numéro RIB pour les dons");
    await storage.updateSetting("bank_name", "foundation Intellcap", "Nom de la banque");

    console.log("✅ Default settings initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing settings:", error);
  }
}

initializeSettings();
