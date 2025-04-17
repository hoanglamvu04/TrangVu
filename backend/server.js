const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
const productDetailRoutes = require("./routes/productDetail");
const adminUsersRoutes = require("./routes/adminUsers");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const adminOrdersRoute = require("./routes/adminOrders");
const productDescriptionRoutes = require("./routes/productDescription");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/addressRoutes");

app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/product-details", productDetailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/orders", adminOrdersRoute);
app.use("/api/product-descriptions", productDescriptionRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);

app.get("/", (req, res) => {
  res.send("Lâm Vũ Nè 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
