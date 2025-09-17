const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

function mountRoute(urlPrefix, relativeFilePath) {
  const absPath = path.join(__dirname, relativeFilePath);
  if (!fs.existsSync(absPath)) {
    console.warn(`⚠️  Route file not found: ${relativeFilePath} (mounted at ${urlPrefix}). Hãy tạo file này hoặc chỉnh lại đường dẫn require.`);
    return;
  }
  const router = require(absPath);
  app.use(urlPrefix, router);
}

mountRoute("/api/admin/users", "./routes/adminUsers.js");
mountRoute("/api/product-details", "./routes/productDetail.js");
mountRoute("/api/auth", "./routes/auth.js");
mountRoute("/api/categories", "./routes/category.js");
mountRoute("/api/products", "./routes/product.js");
mountRoute("/api/admin/orders", "./routes/adminOrders.js");
mountRoute("/api/product-descriptions", "./routes/productDescription.js");
mountRoute("/api/cart", "./routes/cart.js");
mountRoute("/api/addresses", "./routes/addressRoutes.js");
mountRoute("/api/orders", "./routes/orderPublicRoutes.js");
mountRoute("/api/notifications", "./routes/notifications.js");
mountRoute("/api/admin", "./routes/adminRoutes.js");
mountRoute("/api/reviews", "./routes/review.js");
mountRoute("/api/admin/reviews", "./routes/adminReviews.js");
mountRoute("/api/collections", "./routes/adminCollection.js");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Lâm Vũ Nè 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
