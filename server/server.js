import dns from "dns";
dns.setServers(['1.1.1.1']);
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commetnRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;
// const __dirname = path.resolve();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "../client/dist");
const uploadDir = path.join(__dirname, "uploads");
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// if(process.env.NODE_ENV !== "production") {
//   app.use(cors());
// }
if (process.env.NODE_ENV !== "production" || allowedOrigins.length > 0) {
  app.use(cors({
    origin(origin, callback) {
      if (!origin || process.env.NODE_ENV !== "production" || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  }));
}

app.use(express.json());
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(uploadDir));

// app.get("/", (req, res) => {
//    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
// });

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// for deployment
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/dist")));
//
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });
// }
app.use(express.static(clientDist));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
