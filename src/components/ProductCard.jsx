import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../styles/ProductCard.css";
import { Link } from "react-router-dom";
import ProductQuickViewModal from "./ProductQuickViewModal";

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("buy");
  const [selectedColor, setSelectedColor] = useState(null);
  const [displayImage, setDisplayImage] = useState(product.image);

  // Reset khi product thay đổi (VD: sang sản phẩm mới)
  useEffect(() => {
    setSelectedColor(null);
    setDisplayImage(product.image);
  }, [product]);

  const handleColorClick = (colorCode) => {
    if (selectedColor === colorCode) {
      setSelectedColor(null);
      setDisplayImage(product.image);
    } else {
      setSelectedColor(colorCode);
      const newImage = product.colorImages?.[colorCode];
      setDisplayImage(newImage || product.image);
    }
  };

  return (
    <div className="product-card">
      <div className="product-rating">
        <span>★ {product.rating}</span>
        <span>({product.reviews})</span>
      </div>

      <a href="#">
        <div className="product-image-wrapper">
          <img src={displayImage} alt={product.name} />
        </div>
      </a>


      <Link to={`/product/${product.id}`}>
        <div className="product-name">{product.name}</div>
      </Link>

      {/* Dot chọn màu */}
      <div className="product-colors">
        {product.colors.slice(0, 4).map((color, index) => {
          const isWhite =
            color.code.toLowerCase() === "#ffffff" ||
            color.code.toLowerCase() === "white";
          return (
            <span
              key={index}
              className={`color-option ${isWhite ? "white" : ""} ${
                selectedColor === color.code ? "active" : ""
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
              onClick={() => handleColorClick(color.code)}
            ></span>
          );
        })}
        
        {/* Nếu có nhiều hơn 5 màu thì hiển thị dấu +N */}
        {product.colors.length > 4 && (
          <span className="color-more">+{product.colors.length - 4}</span>
        )}
      </div>


      <div className="product-prices">
        {product.currentPrice && (
          <span className="current-price">{product.currentPrice}đ</span>
        )}
        {product.oldPrice && (
          <span className="old-price">{product.oldPrice}đ</span>
        )}
        {product.discount && (
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
