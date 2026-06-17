import Payment from "../models/Payment.js";

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

    const payments = await Payment.find({ user: userId });

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

export const createPayment = async (req, res) => {
  try {
    let { userId, amount, month, year, description, status } = req.body;

    // If requester is not admin, force payment user to be the authenticated user
    if (req.user.role !== "admin") {
      userId = req.user.id;
    }

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
