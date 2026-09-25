import jwt from "jsonwebtoken";
import { User } from "../schemas/user-schema.js";

export const requireAuth = (request, response, next) => {
  const header = request.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return response.status(401).json({ message: "Login required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return response.status(401).json({ message: "Invalid or expired session" });
  }
};

export const requireAdmin = (request, response, next) => {
  requireAuth(request, response, async () => {
    try {
      // The token carries the role it was signed with, but a role can change
      // after that — and a token issued to someone since demoted must not keep
      // working for a week. The record is the authority, not the claim.
      const user = await User.findById(request.user.id).select("role");

      if (!user || user.role !== "admin") {
        return response.status(403).json({ message: "Admin access required" });
      }

      request.user.role = user.role;
      next();
    } catch (err) {
      return response.status(500).json({ message: "Could not verify the session" });
    }
  });
};
