import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProductDetailManager.css";

const ProductDetailManager = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    detailCode: "",
    productCode: "",
    colorCode: "",
    colorName: "",
    size: "",
    quantity: "",
    image: null,
  });

  const colorOptions = [
    { code: "#FF0000", name: "Đỏ tươi" },
    { code: "#8B0000", name: "Đỏ sẫm" },
    { code: "#0000FF", name: "Xanh dương" },
    { code: "#006400", name: "Xanh rêu" },
    { code: "#FFFFFF", name: "Trắng" },
  ];

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: name === "image" ? files[0] : value,
    });
  };

  const handleColorSelect = (code, name) => {
    setForm({
      ...form,
      colorCode: code,
      colorName: name,
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      await axios.post("http://localhost:5000/api/product-details", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Chi tiết sản phẩm đã được thêm!");
    } catch (error) {
      alert("Lỗi khi thêm chi tiết sản phẩm: " + error.message);
    }
  };

  return (
    <div className="product-detail-form">
      <h3 className="product-detail-title">Thêm chi tiết sản phẩm</h3>

      <input
        name="detailCode"
        placeholder="Mã chi tiết"
        value={form.detailCode}
        onChange={handleChange}
        className="product-detail-input"
      />
      <select
        name="productCode"
        value={form.productCode}
        onChange={handleChange}
        className="product-detail-select"
      >
        <option value="">-- Chọn sản phẩm --</option>
        {products.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name} ({p.code})
          </option>
        ))}
      </select>

      <div className="product-detail-color-picker">
        <label>Chọn màu:</label>
        <div className="product-detail-color-options">
          {colorOptions.map((color) => (
            <div
              key={color.code}
              className={`product-detail-color-item ${
                form.colorCode === color.code ? "selected" : ""
              }`}
              onClick={() => handleColorSelect(color.code, color.name)}
              title={color.name}
            >
              <div
                className="product-detail-dot"
                style={{
                  backgroundColor: color.code,
                  border: color.code === "#FFFFFF" ? "1px solid #ccc" : "none",
                }}
              />
              <span>{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      <select
        name="size"
        value={form.size}
        onChange={handleChange}
        className="product-detail-select"
      >
        <option value="">-- Chọn size --</option>
        {sizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <input
        name="quantity"
        placeholder="Số lượng (để trống)"
        value={form.quantity}
        onChange={handleChange}
        className="product-detail-input"
      />

      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="product-detail-file"
      />

      <button onClick={handleSubmit} className="product-detail-submit">
        Thêm chi tiết
      </button>
    </div>
  );
};

export default ProductDetailManager;
