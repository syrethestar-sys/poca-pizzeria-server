import jwt from "jsonwebtoken";

// The signed-in user behind a request, if any. Used where signing in is
// optional (placing an order): the account comes from the token, never from
// a user id in the request body.
export const optionalUserId = (request) => {
  const header = request.headers.authorization ?? "";
  if (!header.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(header.slice(7), process.env.JWT_SECRET).id ?? null;
  } catch {
    return null;
  }
};
