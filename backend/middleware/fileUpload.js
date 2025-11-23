import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base Upload Directory
const baseUploadPath = path.join(__dirname, "../uploads");

// Ensure base directory exists
if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Utility to create subdirectory storage
const getStorage = (folder) => {
  const uploadPath = path.join(baseUploadPath, folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
};

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp',  'image/jpg'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid image type"), false);
};

// Export separate upload configs
export const heritagePic = multer({
  storage: getStorage("heritage-pic"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
});

export const uploadUserProfile = multer({
  storage: getStorage("user-profiles"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});
