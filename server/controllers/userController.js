import User from "../models/User.js";
import Post from "../models/Post.js";
import Payment from "../models/Payment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, mobile } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "member",
      mobile: mobile || ""
    };

    if (req.files) {
      if (req.files.profilePhoto) {
        userData.profilePhoto = req.files.profilePhoto[0].path.replace(/\\/g, '/');
      }
      if (req.files.nid) {
        userData.nid = req.files.nid[0].path.replace(/\\/g, '/');
      }
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        nid: user.nid
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const posts = await Post.find({ author: req.user.id })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const monthMap = {
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

const monthIndex = (monthName) => monthMap[monthName] || 0;

const monthsBetween = (startMonth, startYear, endMonth, endYear) => {
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const payments = await Payment.find();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const usersWithSummary = users.map((user) => {
      const userPayments = payments.filter(
        (payment) => payment.user.toString() === user._id.toString()
      );

      const totalDeposit = userPayments.reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate expected amount from Sept 2022 to current month
      let expectedAmount = 0;
      for (let year = 2022; year <= currentYear; year++) {
        const startMonth = year === 2022 ? 9 : 1; // September for 2022, January for others
        const endMonth = year === currentYear ? currentMonth : 12;
        const monthlyRate = year === 2022 ? 700 : 1000;
        expectedAmount += (endMonth - startMonth + 1) * monthlyRate;
      }

      // Due amount = max(0, expected - deposit)
      const dueAmount = Math.max(0, expectedAmount - totalDeposit);

      return {
        ...user.toObject(),
        totalDeposit,
        dueAmount
      };
    });

    res.json(usersWithSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete all payments associated with this user
    await Payment.deleteMany({ user: id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePhoto) {
        user.profilePhoto = req.files.profilePhoto[0].path.replace(/\\/g, '/');
      }
      if (req.files.nid) {
        user.nid = req.files.nid[0].path.replace(/\\/g, '/');
      }
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        nid: user.nid
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
