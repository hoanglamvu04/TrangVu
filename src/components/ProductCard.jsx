import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ProductQuickViewModal from "./ProductQuickViewModal";
import axios from "axios";
import "../styles/ProductCard.css";

const API_URL = "http://localhost:5000";

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("buy");
  const [selectedColor, setSelectedColor] = useState(null);
  const [displayImage, setDisplayImage] = useState(""); // sẽ set bằng image hoặc màu

  const [colors, setColors] = useState([]);

  useEffect(() => {
    setDisplayImage(product.image ? `${API_URL}${product.image}` : "/assets/default.jpg");
    setSelectedColor(null);
    fetchColors();
  }, [product]);

  const fetchColors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-details/${product.code}`);
      const uniqueColors = [];
      const seen = new Set();
      res.data.forEach((d) => {
        if (d.colorCode && !seen.has(d.colorCode)) {
          seen.add(d.colorCode);
          uniqueColors.push({
            code: d.colorCode,
            name: d.colorName,
            image: d.image ? `${API_URL}${d.image}` : null,
          });
        }
      });
      setColors(uniqueColors);
    } catch (err) {
      console.error("Lỗi khi tải màu:", err);
    }
  };

  const handleColorClick = (color) => {
    if (selectedColor?.code === color.code) {
      setSelectedColor(null);
      setDisplayImage(product.image ? `${API_URL}${product.image}` : "/assets/default.jpg");
    } else {
      setSelectedColor(color);
      setDisplayImage(color.image || (product.image ? `${API_URL}${product.image}` : "/assets/default.jpg"));
    }
  };

  return (
    <div className="product-card">
      <div className="product-rating">
        <span>★ {product.rating || "5.0"}</span>
        <span>({product.reviews || "0"})</span>
      </div>

      <div className="product-image-wrapper">
        <img src={displayImage} alt={product.name} />
      </div>

      <Link to={`/product/${product.code || product.id}`}>
        <div className="product-name">{product.name}</div>
      </Link>

      {colors.length > 0 && (
        <div className="product-colors">
          {colors.slice(0, 4).map((color, index) => {
            const isWhite =
              color.code.toLowerCase() === "#ffffff" || color.code.toLowerCase() === "white";
            return (
              <span
                key={index}
                className={`color-option ${isWhite ? "white" : ""} ${
                  selectedColor?.code === color.code ? "active" : ""
                }`}
                style={{ backgroundColor: color.code }}
                title={color.name}
                onClick={() => handleColorClick(color)}
              ></span>
            );
          })}
          {colors.length > 4 && (
            <span className="color-more">+{colors.length - 4}</span>
          )}
        </div>
      )}

      <div className="product-prices">
        {product.finalPrice && (
          <span className="current-price">
            {Number(product.finalPrice).toLocaleString()}đ
          </span>
        )}
        {product.originalPrice && product.discount > 0 && (
          <span className="old-price">
            {Number(product.originalPrice).toLocaleString()}đ
          </span>
        )}
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </div>

      <div className="product-buttons">
        <button
          className="buy-now-btn"
          onClick={() => {
            setModalAction("buy");
            setShowModal(true);
          }}
        >
          Mua ngay
        </button>
        <button
          className="add-to-cart-btn"
          onClick={() => {
            setModalAction("cart");
            setShowModal(true);
          }}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>

      {showModal && (
        <ProductQuickViewModal
          product={product}
          onClose={() => setShowModal(false)}
          actionType={modalAction}
        />
      )}
    </div>
  );
};

export default ProductCard;
