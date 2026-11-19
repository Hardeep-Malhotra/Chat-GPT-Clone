import express from "express";
import cors from "cors";
import "dotenv/config";

import healthRoutes from "./routes/health.controller.js";
import chatRoutes from "./routes/chat.routes.js"
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", chatRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("AI Chatbot Backend is Running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
