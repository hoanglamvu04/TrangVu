import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import ProductQuickViewModal from "./ProductQuickViewModal";
import axios from "axios";
import "../styles/ProductCard.css";

// Sử dụng biến môi trường cho API_URL
const API_URL = process.env.REACT_APP_API_URL;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("buy");
  const [selectedColor, setSelectedColor] = useState(null);
  const [displayImage, setDisplayImage] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colorImages, setColorImages] = useState({});

  // Đảm bảo selectedSize được khởi tạo
  const [selectedSize, setSelectedSize] = useState(null);  // khởi tạo selectedSize

  useEffect(() => {
    setDisplayImage(product.image ? `${API_URL}${product.image}` : "/assets/default.jpg");
    setSelectedColor(null);
    fetchDetails();
  }, [product]);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-details/${product.code}`);
      const uniqueColors = [];
      const seenColors = new Set();
      const seenSizes = new Set();
      const colorImgMap = {};

      res.data.forEach((detail) => {
        if (detail.colorCode && !seenColors.has(detail.colorCode)) {
          seenColors.add(detail.colorCode);
          uniqueColors.push({
            code: detail.colorCode,
            name: detail.colorName,
          });
          colorImgMap[detail.colorCode] = `${API_URL}${detail.image}`;
        }
        if (detail.size) seenSizes.add(detail.size);
      });

      setColors(uniqueColors);
      setSizes(Array.from(seenSizes));
      setColorImages(colorImgMap);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", err);
    }
  };

  const handleColorClick = (color) => {
    if (selectedColor?.code === color.code) {
      setSelectedColor(null);
      setDisplayImage(product.image ? `${API_URL}${product.image}` : "/assets/default.jpg");
    } else {
      setSelectedColor(color);
      setDisplayImage(colorImages?.[color.code] || `${API_URL}${product.image}`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedColor) {
      alert("Vui lòng chọn màu sắc.");
      return;
    }
    // Tạo một đối tượng sản phẩm cho việc mua ngay
    const selectedProduct = {
      productCode: product.code,
      name: product.name,
      selectedColor,
      selectedSize,
      quantity: 1,
      price: product.finalPrice,
      image: displayImage,
    };

    // Chuyển đến trang thanh toán với sản phẩm đã chọn
    navigate("/checkout", {
      state: { selectedProduct }
    });
  };

  const handleAddToCart = () => {
    setModalAction("cart");
    setShowModal(true);
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
                className={`color-option ${isWhite ? "white" : ""} ${selectedColor?.code === color.code ? "active" : ""}`}
                style={{ backgroundColor: color.code }}
                title={color.name}
                onClick={() => handleColorClick(color)}
              ></span>
            );
          })}
          {colors.length > 4 && <span className="color-more">+{colors.length - 4}</span>}
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
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Mua ngay
        </button>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>

      {showModal && (
        <ProductQuickViewModal
          product={{
            ...product,
            colors,
            sizes,
            colorImages,
          }}
          onClose={() => setShowModal(false)}
          actionType={modalAction}
        />
      )}
    </div>
  );
};

export default ProductCard;
