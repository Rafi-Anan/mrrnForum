import express from "express";
import {
  getUserPayments,
  createPayment,
  updatePayment,
  deletePayment
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get payments for a specific user
router.get("/user/:userId", authMiddleware, adminMiddleware, getUserPayments);

// Create a new payment
router.post("/", authMiddleware, adminMiddleware, createPayment);

// Update a payment
router.put("/:id", authMiddleware, adminMiddleware, updatePayment);

// Delete a payment
router.delete("/:id", authMiddleware, adminMiddleware, deletePayment);

export default router;