import dns from "dns";
dns.setServers(['1.1.1.1']);
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commetnRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();



const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_ORIGIN]
  .filter(Boolean)
  .flatMap((origins) => origins.split(","))
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include Render health checks and
    // same-origin server requests.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "../client/dist/index.html"))
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
// for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
}


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
