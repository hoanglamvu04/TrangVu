import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuickViewModal.css";
import { useCart } from "../contexts/CartContext";

const ProductQuickViewModal = ({ product, onClose, actionType = "buy" }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product) {
      const defaultColor = product.colors?.[0]?.code || "";
      setSelectedColor(defaultColor);
      setSelectedSize(product.sizes?.[0] || "");
      const defaultImg =
        product.colorImages?.[defaultColor] || product.image || "/assets/default.jpg";
      setSelectedImage(defaultImg);
    }
  }, [product]);

  const handleQtyChange = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const handleConfirm = () => {
    if (actionType === "buy") {
      navigate("/checkout", {
        state: { product, selectedColor, selectedSize, quantity },
      });
    } else {
      addToCart({
        productCode: product.code,
        name: product.name,
        selectedColor,
        selectedSize,
        quantity,
        price: product.finalPrice || product.price,
        image: product.colorImages?.[selectedColor] || product.image || "/assets/default.jpg"
      });
      
      alert(
        `Đã thêm vào giỏ:\n- ${product.name}\n- Màu: ${getSelectedColorName()}\n- Size: ${selectedSize}\n- SL: ${quantity}`
      );
      onClose();
    }
  };

  const getSelectedColorName = () => {
    return (
      product.colors?.find((color) => color.code === selectedColor)?.name || ""
    );
  };

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-horizontal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        {/* Cột ảnh */}
        <div className="modal-left">
          <div className="main-image-wrapper">
            <img
              src={selectedImage}
              alt={product.name}
              className="modal-image"
            />
          </div>
        </div>

        {/* Cột thuộc tính */}
        <div className="modal-right">
          <h2 className="modal-title">{product.name}</h2>

          {/* Màu sắc */}
          <div className="modal-section">
            <label>
              Màu sắc: <strong>{getSelectedColorName()}</strong>
            </label>
            <div className="color-options">
              {product.colors?.map((color, idx) => {
                const isWhite =
                  color.code.toLowerCase() === "#ffffff" ||
                  color.code.toLowerCase() === "white";
                return (
                  <div key={idx} className="color-wrapper">
                    <span
                      className={`color-dot ${isWhite ? "white" : ""} ${
                        selectedColor === color.code ? "active" : ""
                      }`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => {
                        setSelectedColor(color.code);
                        setSelectedImage(
                          product.colorImages?.[color.code] ||
                          product.image ||
                          "/assets/default.jpg"
                        );
                      }}
                    ></span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div className="modal-section">
            <label>Kích cỡ:</label>
            <div className="size-options">
              {product.sizes?.map((size) => {
                const isOutOfStock = product.sizeStock?.[size] === 0;
                return (
                  <span
                    key={size}
                    className={`size-box ${
                      selectedSize === size ? "active" : ""
                    } ${isOutOfStock ? "disabled" : ""}`}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                  >
                    {size}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Số lượng */}
          <div className="modal-section">
            <label>Số lượng:</label>
            <div className="qty-control">
              <button onClick={() => handleQtyChange("decrease")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQtyChange("increase")}>+</button>
            </div>
          </div>

          <button className="confirm-btn" onClick={handleConfirm}>
            {actionType === "buy" ? "Mua ngay" : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
