import express from "express";
import { addComment, getCommentsByPost } from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:postId", getCommentsByPost);
router.post("/:postId", authMiddleware, addComment);

export default router;