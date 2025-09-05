import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();

// ✅ Use Render's PORT or fallback for local dev
const PORT = process.env.PORT || 5001;

// ✅ Allow frontend both in local + production
const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  process.env.FRONTEND_URL                  // production frontend (set in Render)
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ❌ No need to serve frontend here, since you’re deploying it separately on Render

// ✅ Start server only after DB is connected
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error);
    process.exit(1);
  }
};

startServer();
