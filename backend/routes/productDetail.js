const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const ProductDetail = require("../models/ProductDetail");
const upload = require("../middlewares/uploadDetailImage"); // multer.array("images", ...)

/* ========= Helpers ========= */

// Chuẩn hoá segment URL giống middleware
const norm = (s = "") => s.toString().trim().replace(/[^\w\-]+/g, "-");

// Tạo URL ảnh khớp nơi multer lưu
function buildImageUrl({ productCode, colorCode, filename }) {
  const parts = ["/uploads", "products", productCode];
  const cc = norm(colorCode);
  if (cc) parts.push(cc);
  parts.push(filename);
  return parts.join("/").replace(/\\/g, "/").replace(/\/+/g, "/");
}

// Từ URL web -> path thực tế trên đĩa
function urlToDiskPath(url) {
  // /uploads/products/...
  const clean = url.replace(/^\/+/, "");
  return path.join(__dirname, "..", clean);
}

function deleteFiles(urls = []) {
  for (const u of urls) {
    try {
      const fp = urlToDiskPath(u);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    } catch (e) {
      // ignore để không làm fail request
      console.warn("delete file error:", u, e.message);
    }
  }
}

function deleteColorFolder(productCode, colorCode) {
  const folder = path.join(
    __dirname,
    "..",
    "uploads",
    "products",
    productCode,
    norm(colorCode)
  );
  try {
    // Xoá cả folder màu (nếu rỗng hoặc không cần giữ)
    if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true, force: true });
  } catch (e) {
    console.warn("delete folder error:", folder, e.message);
  }
}

function uniqueArray(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

function parseExisting(existingImages) {
  if (!existingImages) return [];
  try {
    const parsed = JSON.parse(existingImages);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return String(existingImages)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ========= APIs ========= */

/** Lấy tất cả chi tiết theo productCode */
router.get("/:productCode", async (req, res) => {
  try {
    const details = await ProductDetail.find({ productCode: req.params.productCode });
    res.json(details);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" });
  }
});

/** Tạo chi tiết: Ảnh theo MÀU, không theo size */
router.post("/", upload.array("images", 20), async (req, res) => {
  try {
    const { productCode, colorCode, colorName, size, quantity } = req.body;

    // Ảnh mới upload (nếu có)
    const uploaded = (req.files || []).map((f) =>
      buildImageUrl({ productCode, colorCode, filename: f.filename })
    );

    // Tìm mọi detail cùng màu
    const siblings = await ProductDetail.find({ productCode, colorCode }).lean();
    const firstWithImages = siblings.find((s) => Array.isArray(s.images) && s.images.length > 0);

    let imagesForColor = [];
    if (firstWithImages) {
      // Màu đã có ảnh -> bỏ ảnh mới upload để tránh trùng & lãng phí ổ đĩa
      deleteFiles(uploaded);
      imagesForColor = firstWithImages.images;
    } else {
      // Màu CHƯA có ảnh -> dùng ảnh vừa upload
      imagesForColor = uploaded;
      if (siblings.length) {
        // Có siblings nhưng trước đó chưa có ảnh -> đồng bộ tất cả
        await ProductDetail.updateMany(
          { productCode, colorCode },
          { $set: { images: imagesForColor } }
        );
      }
    }

    const newDetail = new ProductDetail({
      detailCode: "CT" + Date.now(),
      productCode,
      colorCode,
      colorName,
      size,
      quantity,
      images: imagesForColor,
    });

    await newDetail.save();
    res.status(201).json(newDetail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm chi tiết" });
  }
});

/** Cập nhật chi tiết:
 *  - Ảnh luôn đồng bộ cho TẤT CẢ size cùng màu.
 *  - replaceImages="1": thay toàn bộ; "0" hoặc không gửi: append.
 */
router.put("/:id", upload.array("images", 20), async (req, res) => {
  try {
    const {
      productCode,
      colorCode,
      colorName,
      size,
      quantity,
      existingImages,
      replaceImages,
    } = req.body;

    const detail = await ProductDetail.findById(req.params.id);
    if (!detail) return res.status(404).json({ error: "Không tìm thấy chi tiết" });

    const finalProductCode = productCode || detail.productCode;
    const finalColorCode = colorCode || detail.colorCode;

    const siblings = await ProductDetail.find({
      productCode: finalProductCode,
      colorCode: finalColorCode,
    }).lean();

    // Ảnh mới upload
    const newUploaded = (req.files || []).map((f) =>
      buildImageUrl({
        productCode: finalProductCode,
        colorCode: finalColorCode,
        filename: f.filename,
      })
    );

    // Ảnh giữ lại do FE gửi
    const keep = parseExisting(existingImages);

    // Ảnh hiện tại của màu (lấy từ 1 sibling bất kỳ)
    const currentImages =
      (siblings.find((s) => Array.isArray(s.images))?.images || detail.images || []).slice();

    let finalImages;
    if (replaceImages === "1") {
      // thay toàn bộ
      finalImages = uniqueArray([...keep, ...newUploaded]);

      // Xoá file cũ không còn dùng
      const toRemove = currentImages.filter((u) => !finalImages.includes(u));
      deleteFiles(toRemove);
    } else {
      // mặc định append
      finalImages = uniqueArray([...currentImages, ...keep, ...newUploaded]);
    }

    // Đồng bộ ảnh cho TẤT CẢ bản ghi cùng màu
    await ProductDetail.updateMany(
      { productCode: finalProductCode, colorCode: finalColorCode },
      { $set: { images: finalImages } }
    );

    // Update các field khác của bản ghi đang sửa
    detail.productCode = finalProductCode;
    detail.colorCode = finalColorCode;
    detail.colorName = colorName ?? detail.colorName;
    detail.size = size ?? detail.size;
    detail.quantity = quantity ?? detail.quantity;
    detail.images = finalImages;
    const updated = await detail.save();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật chi tiết" });
  }
});

/** Xoá 1 ảnh khỏi màu (gắn theo id chi tiết nào cũng được) */
router.delete("/:id/images", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const d = await ProductDetail.findById(req.params.id);
    if (!d) return res.status(404).json({ error: "Không tìm thấy chi tiết" });

    const { productCode, colorCode } = d;
    // Trừ ảnh khỏi tất cả bản ghi cùng màu
    const siblings = await ProductDetail.find({ productCode, colorCode });
    siblings.forEach((s) => (s.images = (s.images || []).filter((u) => u !== imageUrl)));
    await Promise.all(siblings.map((s) => s.save()));

    // Xoá file vật lý
    deleteFiles([imageUrl]);

    res.json({ message: "Đã xoá ảnh", images: siblings[0]?.images || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Xoá ảnh thất bại" });
  }
});

/** Xoá chi tiết:
 *  - Nếu còn size khác cùng màu -> giữ ảnh.
 *  - Nếu KHÔNG còn bản ghi nào cùng màu -> xoá tất cả file ảnh của màu & xoá thư mục màu.
 */
router.delete("/:id", async (req, res) => {
  try {
    const detail = await ProductDetail.findById(req.params.id);
    if (!detail) return res.status(404).json({ error: "Không tìm thấy chi tiết" });

    const { productCode, colorCode, images } = detail;

    await ProductDetail.findByIdAndDelete(req.params.id);

    const remain = await ProductDetail.countDocuments({ productCode, colorCode });
    if (remain === 0) {
      // Không còn size nào cho màu này -> xoá files và folder
      deleteFiles(images || []);
      deleteColorFolder(productCode, colorCode);
    }

    res.json({ message: "Xoá thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Xoá thất bại" });
  }
});

module.exports = router;
