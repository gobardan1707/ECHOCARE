import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cron from "node-cron";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import { SchedulerService } from "./services/schedulerService.js";
import { initializeDatabase } from "./config/setup.js"; // this runs the SQL file
import { checkDatabaseSchema } from "./config/database.js"; // optional validator
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();


// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Add this middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// routes
// Keep-alive endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.use("/api", routes);
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));


// Initialization function
const initializeApp = async () => {
  console.log("🚀 Starting EchoCare Backend...");

  try {
    // STEP 1: Initialize schema
    console.log("📊 Running DB migration...");
    await initializeDatabase();
    console.log("✅ Migration complete");

    // STEP 2: Optionally verify
    const dbValid = await checkDatabaseSchema();
    if (!dbValid) {
      console.error("❌ Schema check failed. Exiting...");
      process.exit(1);
    }

    // STEP 3: Initialize scheduler
    console.log("⏰ Initializing scheduler...");
    SchedulerService.initializeScheduler();

    console.log("✅ App initialization complete");
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
};

// Start app after full initialization
initializeApp();

cron.schedule("0 0 * * *", () => {
  console.log("🕐 Daily cron job running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌟 EchoCare server is running on port ${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
});
