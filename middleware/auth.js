import jwt from "jsonwebtoken";

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
  requireAuth(request, response, () => {
    if (request.user.role !== "admin") {
      return response.status(403).json({ message: "Admin access required" });
    }
    next();
  });
};
