import { User } from "../../schemas/user-schema.js";

const safe = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role,
});

// Clerk says whether someone is signed in. It does not say whether they are an
// admin — that lives here — so this is where the front end finds out who it is
// actually talking to. The middleware has already verified the session; this
// reads the record fresh, so the role the client holds is the one in the
// database rather than anything it was handed earlier.
export const meController = async (request, response) => {
  try {
    const user = await User.findById(request.user.id);

    if (!user) {
      return response.status(401).json({ message: "Session no longer valid" });
    }

    response.status(200).json({ message: "ok", user: safe(user) });
  } catch (err) {
    response.status(500).json({ message: "Internal server error" });
  }
};
