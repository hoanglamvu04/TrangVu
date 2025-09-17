const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const slug =
      (req.body.slug || req.body.collectionCode || "collection")
        .toString()
        .trim() || "collection";
    const dir = path.join(__dirname, "..", "uploads", "collections", slug);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = file.fieldname === "heroImage" ? "hero" : "banner";
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

module.exports = multer({ storage });
