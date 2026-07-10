import Payment from "../models/Payment.js";
import PaymentRequest from "../models/PaymentRequest.js";

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};

export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow if requester is admin or requesting their own payments
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const payments = await Payment.find({ user: userId, status: { $ne: "pending" } });

    payments.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return monthOrder[a.month] - monthOrder[b.month];
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingPayments = async (req, res) => {
  try {
    const requests = await PaymentRequest.find({ status: "pending" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Failed to fetch payment requests:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { userId, amount, month, year, description, status } = req.body;

    const payment = await Payment.create({
      user: userId,
      amount,
      month,
      year,
      description,
      status
    });

    const populated = await Payment.findById(payment._id).populate("user", "name email");

    res.status(201).json({
      message: "Payment created successfully",
      payment: populated
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Payment already exists for this month/year" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const createPaymentRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, month, year, description } = req.body;

    const existingPayment = await Payment.findOne({ user: userId, month, year });
    if (existingPayment) {
      return res.status(400).json({ message: "Payment already exists for this month/year" });
    }

    const existingRequest = await PaymentRequest.findOne({
      user: userId,
      month,
      year,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ message: "A payment request is already pending for this month/year" });
    }

    const paymentRequest = await PaymentRequest.create({
      user: userId,
      amount,
      month,
      year,
      description,
      status: "pending"
    });

    const populatedRequest = await PaymentRequest.findById(paymentRequest._id).populate("user", "name email");

    res.status(201).json({
      message: "Payment request submitted successfully",
      paymentRequest: populatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewPaymentRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const paymentRequest = await PaymentRequest.findById(id);

    if (!paymentRequest) {
      return res.status(404).json({ message: "Payment request not found" });
    }

    if (paymentRequest.status !== "pending") {
      return res.status(400).json({ message: "Payment request has already been reviewed" });
    }

    paymentRequest.status = status;
    paymentRequest.reviewedAt = new Date();

    let payment = null;
    if (status === "approved") {
      const existingPayment = await Payment.findOne({
        user: paymentRequest.user,
        month: paymentRequest.month,
        year: paymentRequest.year
      });

      if (existingPayment) {
        return res.status(400).json({ message: "Payment already exists for this month/year" });
      }

      payment = await Payment.create({
        user: paymentRequest.user,
        amount: paymentRequest.amount,
        month: paymentRequest.month,
        year: paymentRequest.year,
        description: paymentRequest.description,
        status: "completed"
      });
    }

    await paymentRequest.save();

    res.json({
      message: status === "approved" ? "Payment request approved" : "Payment request declined",
      paymentRequest,
      payment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Payment already exists for this month/year" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const payment = await Payment.findByIdAndUpdate(id, updates, { new: true })
      .populate("user", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      message: "Payment updated successfully",
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePayments = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No payment IDs provided" });
    }

    const result = await Payment.deleteMany({ _id: { $in: ids } });

    res.json({ message: "Payments deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
