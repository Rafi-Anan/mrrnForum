import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
    role: {
      type: String,
      enum: ["member", "admin", "president", "vice-president", "cashier"],
      default: "member"
    },
    mobile: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    nid: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);