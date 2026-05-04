import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getAllUsers, getMyProfile, createUser, deleteUser, updateUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/me", authMiddleware, getMyProfile);
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.post("/", authMiddleware, adminMiddleware, upload.fields([{ name: 'profilePhoto' }, { name: 'nid' }]), createUser);
router.put("/:id", authMiddleware, adminMiddleware, upload.fields([{ name: 'profilePhoto' }, { name: 'nid' }]), updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;