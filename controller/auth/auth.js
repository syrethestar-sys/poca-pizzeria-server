import bcrypt from "bcrypt";
import { User } from "../../schemas/user-schema.js";

const safe = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role,
});

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

    response.status(200).json({ message: "Login successful", user: safe(user) });
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
