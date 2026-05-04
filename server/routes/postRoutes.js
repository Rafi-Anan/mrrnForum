import express from "express";
import {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLikePost
} from "../controllers/postControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getSinglePost);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id/like", authMiddleware, toggleLikePost);

export default router;