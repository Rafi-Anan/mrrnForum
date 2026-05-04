import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    month: {
      type: String,
      required: true,
      enum: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
    },
    year: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed"
    }
  },
  { timestamps: true }
);

// Compound index to ensure one payment per user per month/year
paymentSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Payment", paymentSchema);