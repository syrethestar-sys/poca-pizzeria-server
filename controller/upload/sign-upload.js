import crypto from "node:crypto";

// Folder every admin upload lands in. Part of the signature, so the browser
// cannot redirect an upload into another folder.
const UPLOAD_FOLDER = "poca";

// Signs one Cloudinary upload for a logged-in admin. The API secret never
// leaves the server; the browser gets a signature that is only valid for
// these exact parameters and for about an hour (Cloudinary rejects stale
// timestamps). This replaces the unsigned preset anyone could use.
export const signUploadController = (request, response) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return response.status(503).json({ message: "Image uploads are not configured on the server" });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: UPLOAD_FOLDER, timestamp };

  // Cloudinary: sort the parameters, join as key=value with "&", append the
  // secret, SHA-1 the lot.
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = crypto
    .createHash("sha1")
    .update(toSign + CLOUDINARY_API_SECRET)
    .digest("hex");

  response.status(200).json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder: UPLOAD_FOLDER,
    timestamp,
    signature,
  });
};
