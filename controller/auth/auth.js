import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../schemas/user-schema.js";
import { sendPasswordResetEmail } from "../../lib/mailer.js";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const safe = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role,
});

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const loginController = async (request, response) => {
  try {
    const { email, password } = request.body ?? {};

    const user = await User.findOne({ email: String(email ?? "").toLowerCase() });

    if (!user) {
      return response.status(401).json({ message: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response.status(401).json({ message: "Incorrect email or password" });
    }

    response
      .status(200)
      .json({ message: "Login successful", user: safe(user), token: signToken(user) });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};

export const signUpController = async (request, response) => {
  try {
    const { email, password, name, phone } = request.body ?? {};

    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required" });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return response.status(409).json({ message: "That email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: String(email).toLowerCase(),
      password: hashedPassword,
      name: name ?? "",
      phone: phone ?? "",
    });

    response.status(201).json({ message: "User created", user: safe(user) });
  } catch (err) {
    response.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const forgotPasswordController = async (request, response) => {
  try {
    const { email } = request.body ?? {};

    if (!email) {
      return response.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordTokenHash = hashToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    response
      .status(200)
      .json({ message: "If that email is registered, a reset link is on its way" });
  } catch (err) {
    response.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const resetPasswordController = async (request, response) => {
  try {
    const { email, token, password } = request.body ?? {};

    if (!email || !token || !password) {
      return response.status(400).json({ message: "Email, token, and password are required" });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase(),
      resetPasswordExpires: { $gt: new Date() },
    });

    const incomingHash = hashToken(token);
    const isValidToken =
      user?.resetPasswordTokenHash &&
      crypto.timingSafeEqual(
        Buffer.from(incomingHash),
        Buffer.from(user.resetPasswordTokenHash),
      );

    if (!isValidToken) {
      return response.status(400).json({ message: "That reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    response.status(200).json({ message: "Password updated. You can log in now" });
  } catch (err) {
    response.status(500).json({ message: "Internal Server Error", error: err });
  }
};
