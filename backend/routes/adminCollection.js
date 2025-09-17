const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const Collection = require("../models/Collection");
const Product = require("../models/Product");
const upload = require("../middlewares/uploadCollectionImage");

const toRel = (abs) =>
  "/" + path.relative(path.join(__dirname, ".."), abs).replace(/\\/g, "/");

const parseList = (v) =>
  Array.isArray(v)
    ? v
    : typeof v === "string"
    ? v
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

const toNumOrUndef = (v) =>
  v === "" || v === undefined || v === null ? undefined : Number(v);

router.get("/", async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    if (req.query.showInNav === "1") q.showInNav = true;
    if (req.query.featured === "1") q.isFeatured = true;
    if (req.query.activeNow === "1") {
      const now = new Date();
      q.$and = [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
      ];
    }
    const rows = await Collection.find(q).sort({ priority: -1, createdAt: -1 });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Error", error: e.message });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const row = await Collection.findOne({ slug: req.params.slug });
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (e) {
    res.status(500).json({ message: "Error", error: e.message });
  }
});

router.get("/:slug/products", async (req, res) => {
  try {
    const col = await Collection.findOne({ slug: req.params.slug });
    if (!col) return res.status(404).json({ message: "Not found" });

    let products = [];
    if (col.type === "manual") {
      products = await Product.find({ code: { $in: col.productCodes || [] } });
    } else {
      const cond = {};
      if (col.rules?.categoryCodes?.length)
        cond.category = { $in: col.rules.categoryCodes };
      if (
        col.rules?.priceMin !== undefined ||
        col.rules?.priceMax !== undefined
      ) {
        cond.finalPrice = {};
        if (col.rules.priceMin !== undefined)
          cond.finalPrice.$gte = col.rules.priceMin;
        if (col.rules.priceMax !== undefined)
          cond.finalPrice.$lte = col.rules.priceMax;
      }
      if (col.rules?.discountMin !== undefined)
        cond.discount = { $gte: col.rules.discountMin };
      if (col.rules?.tags?.length) cond.tags = { $in: col.rules.tags };
      products = await Product.find(cond).sort({ createdAt: -1 });
    }
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Error", error: e.message });
  }
});

router.post(
  "/",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body =
        req.body.data && typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body;

      const payload = {
        collectionCode: body.collectionCode,
        name: body.name,
        slug: body.slug,
        description: body.description,
        status: body.status || "Active",
        type: body.type || "manual",
        priority: Number(body.priority) || 0,
        startAt: body.startAt ? new Date(body.startAt) : undefined,
        endAt: body.endAt ? new Date(body.endAt) : undefined,
        showInNav: !!body.showInNav,
        isFeatured: !!body.isFeatured,
        productCodes: parseList(body.productCodes),
        rules: {
          tags: parseList(body?.rules?.tags || body.tags),
          categoryCodes: parseList(body?.rules?.categoryCodes || body.categoryCodes),
          priceMin: toNumOrUndef(body?.rules?.priceMin ?? body.priceMin),
          priceMax: toNumOrUndef(body?.rules?.priceMax ?? body.priceMax),
          discountMin: toNumOrUndef(body?.rules?.discountMin ?? body.discountMin),
        },
        heroImage: req.files?.heroImage?.[0]
          ? toRel(req.files.heroImage[0].path)
          : body.heroImage || "",
        bannerImage: req.files?.bannerImage?.[0]
          ? toRel(req.files.bannerImage[0].path)
          : body.bannerImage || "",
      };

      const row = await Collection.create(payload);
      res.status(201).json(row);
    } catch (e) {
      res.status(500).json({ message: "Error", error: e.message });
    }
  }
);

router.put(
  "/:id",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body =
        req.body.data && typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body;

      const update = {
        collectionCode: body.collectionCode,
        name: body.name,
        slug: body.slug,
        description: body.description,
        status: body.status,
        type: body.type,
        priority: body.priority !== undefined ? Number(body.priority) : undefined,
        startAt: body.startAt ? new Date(body.startAt) : undefined,
        endAt: body.endAt ? new Date(body.endAt) : undefined,
        showInNav:
          body.showInNav === undefined ? undefined : !!body.showInNav,
        isFeatured:
          body.isFeatured === undefined ? undefined : !!body.isFeatured,
        productCodes:
          body.productCodes === undefined ? undefined : parseList(body.productCodes),
        rules:
          body.rules || body.tags || body.categoryCodes || body.priceMin !== undefined
            ? {
                tags: parseList(body?.rules?.tags || body.tags),
                categoryCodes: parseList(
                  body?.rules?.categoryCodes || body.categoryCodes
                ),
                priceMin: toNumOrUndef(body?.rules?.priceMin ?? body.priceMin),
                priceMax: toNumOrUndef(body?.rules?.priceMax ?? body.priceMax),
                discountMin: toNumOrUndef(
                  body?.rules?.discountMin ?? body.discountMin
                ),
              }
            : undefined,
        heroImage: req.files?.heroImage?.[0]
          ? toRel(req.files.heroImage[0].path)
          : body.heroImage === "" ? "" : undefined,
        bannerImage: req.files?.bannerImage?.[0]
          ? toRel(req.files.bannerImage[0].path)
          : body.bannerImage === "" ? "" : undefined,
      };

      Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

      const row = await Collection.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });
      if (!row) return res.status(404).json({ message: "Not found" });
      res.json(row);
    } catch (e) {
      res.status(500).json({ message: "Error", error: e.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const row = await Collection.findById(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });

    const tryUnlink = (rel) => {
      if (!rel) return;
      const abs = path.join(__dirname, "..", rel);
      if (abs.includes(path.join("uploads", "collections")) && fs.existsSync(abs)) {
        try { fs.unlinkSync(abs); } catch {}
      }
    };
    tryUnlink(row.heroImage);
    tryUnlink(row.bannerImage);

    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Error", error: e.message });
  }
});

module.exports = router;
