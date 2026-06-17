import express from "express";
import {
  getUserPayments,
  createPayment,
  updatePayment,
  deletePayment,
  deletePayments
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get payments for a specific user (admins or the user themselves)
router.get("/user/:userId", authMiddleware, getUserPayments);

// Create a new payment (admins can create for any user; members can create for themselves)
router.post("/", authMiddleware, createPayment);

// Update a payment
router.put("/:id", authMiddleware, adminMiddleware, updatePayment);

// Delete a payment
router.delete("/:id", authMiddleware, adminMiddleware, deletePayment);

// Bulk delete payments
router.post("/bulk-delete", authMiddleware, adminMiddleware, deletePayments);

export default router;