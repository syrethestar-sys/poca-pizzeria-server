import { clerkClient, getAuth } from "@clerk/express";
import { User } from "../schemas/user-schema.js";

// getAuth throws rather than returning empty if clerkMiddleware() never ran on
// this request. That is a wiring mistake rather than a failed login, so it
// reads as "no session" here instead of taking the request down with it.
const clerkSessionId = (request) => {
  try {
    return getAuth(request)?.userId ?? null;
  } catch (err) {
    return null;
  }
};

// A session with no record behind it is someone's first visit since signing
// up. Orders join on _id and the role is read from this collection, so the
// account needs a row here before it can be authorised against — Clerk holds
// the credentials, not the rest of it.
//
// Done here rather than in a webhook: one fewer endpoint to expose, one fewer
// signing secret to keep, and it cannot be missed, because nothing reaches a
// protected route without coming through this function first.
const provision = async (clerkId) => {
  const account = await clerkClient.users.getUser(clerkId);
  const email = (
    account.primaryEmailAddress?.emailAddress ??
    account.emailAddresses?.[0]?.emailAddress ??
    ""
  ).toLowerCase();

  // Every Clerk account has an address; if this one does not, something is
  // wrong enough that inventing a record would only hide it.
  if (!email) return null;

  const name = [account.firstName, account.lastName].filter(Boolean).join(" ");

  try {
    return await User.create({ clerkId, email, name, role: "user" });
  } catch (err) {
    // Email is unique, so an older record already holds this address. Clerk
    // has verified the address belongs to whoever is holding this session, so
    // taking the record over is sound — and the alternative is an account that
    // can sign in forever and never be authorised for anything.
    //
    // Matched on email alone rather than "has no clerkId yet". Pointing the
    // project at a different Clerk instance leaves records carrying an id from
    // the old one, and a narrower match would strand them.
    if (err?.code === 11000) {
      return User.findOneAndUpdate(
        { email },
        { $set: { clerkId } },
        { returnDocument: "after" },
      ).select("_id role");
    }
    throw err;
  }
};

// The role is read here rather than taken from the session token. A token can
// be cached for its whole lifetime and would not notice that someone was
// demoted an hour ago, so the record is the authority — as it was under the
// JWTs this replaced.
const resolveUser = async (request) => {
  const clerkId = clerkSessionId(request);

  if (!clerkId) {
    // A credential that did not resolve is worth telling apart from none at
    // all: it usually means an expired session rather than a signed-out one.
    return { reason: request.headers.authorization ? "invalid" : "missing" };
  }

  const user = (await User.findOne({ clerkId }).select("_id role")) ?? (await provision(clerkId));

  return user ? { user } : { reason: "unlinked" };
};

const deny = (response, reason) => {
  if (reason === "missing") {
    return response.status(401).json({ message: "Login required" });
  }
  if (reason === "unlinked") {
    return response.status(401).json({ message: "That account is not set up yet" });
  }
  return response.status(401).json({ message: "Invalid or expired session" });
};

export const requireAuth = async (request, response, next) => {
  try {
    const { user, reason } = await resolveUser(request);

    if (!user) return deny(response, reason);

    request.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return response.status(500).json({ message: "Could not verify the session" });
  }
};

export const requireAdmin = async (request, response, next) => {
  try {
    const { user, reason } = await resolveUser(request);

    if (!user) return deny(response, reason);

    if (user.role !== "admin") {
      return response.status(403).json({ message: "Admin access required" });
    }

    request.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return response.status(500).json({ message: "Could not verify the session" });
  }
};
