import { getAuth } from "@clerk/express";
import { User } from "../schemas/user-schema.js";

// The signed-in user behind a request, if any. Used where signing in is
// optional (placing an order): the account comes from the session, never from
// a user id in the request body.
//
// Returns the Mongo _id, so the order still joins on the field it always has.
// Resolving a session costs a lookup, which is why this is async.
export const optionalUserId = async (request) => {
  let clerkId = null;
  try {
    clerkId = getAuth(request)?.userId ?? null;
  } catch (err) {
    clerkId = null;
  }

  if (!clerkId) return null;

  const user = await User.findOne({ clerkId }).select("_id");
  return user?._id ?? null;
};
