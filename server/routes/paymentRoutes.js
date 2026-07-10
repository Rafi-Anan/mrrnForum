import express from "express";
import {
  getUserPayments,
  getPendingPayments,
  createPayment,
  createPaymentRequest,
  reviewPaymentRequest,
  updatePayment,
  deletePayment,
  deletePayments
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get payments for a specific user (admins or the user themselves)
router.get("/user/:userId", authMiddleware, getUserPayments);

// Get pending payment requests for admin approval
router.get("/requests/pending", authMiddleware, adminMiddleware, getPendingPayments);
router.get("/pending", authMiddleware, adminMiddleware, getPendingPayments);

// Approve or decline a pending payment request
router.put("/requests/:id", authMiddleware, adminMiddleware, reviewPaymentRequest);

// Members create approval requests; admins create real payments directly
router.post("/request", authMiddleware, createPaymentRequest);
router.post("/", authMiddleware, adminMiddleware, createPayment);

// Update a payment
router.put("/:id", authMiddleware, adminMiddleware, updatePayment);

// Delete a payment
router.delete("/:id", authMiddleware, adminMiddleware, deletePayment);

// Bulk delete payments
router.post("/bulk-delete", authMiddleware, adminMiddleware, deletePayments);

export default router;
