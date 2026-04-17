import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env";
import { ApiError } from "../core/errors/ApiError";

const uploadDir = path.resolve(process.cwd(), "uploads", "student-ids");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const isAllowedType = ["application/pdf", "image/png", "image/jpeg"].includes(
    file.mimetype,
  );

  if (!isAllowedType) {
    callback(new ApiError(400, "Only PDF, PNG, and JPG files are allowed"));
    return;
  }

  callback(null, true);
};

export const studentIdUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});
