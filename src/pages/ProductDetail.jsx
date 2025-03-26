import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetail.css";

const sampleProducts = [
  {
    id: 1,
    name: "Áo Thun Nam Cotton 220GSM",
    images: [
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/spack3tee220.2_copy_copy.jpg",
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.mint1_98_82.jpg",
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.NAU.1_25_22.jpg",
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.TIM.4_39_35.jpg",
    ],
    description: "Chất liệu Cotton 220GSM, mềm mịn, thoáng mát.",
    price: "161.000",
    oldPrice: "179.000",
    discount: "-10%",
    colors: ["#E3DCC9", "#C1C2C2", "#1E3A8A", "#566E5A", "#000000", "#ffffff"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    benefits: [
      "Chất liệu 100% Cotton",
      "Định lượng vải 220gsm dày dặn",
      "Xử lý bề mặt chống xù lông, mềm mịn",
      "Thoáng mát, thoải mái khi mặc",
      "Phù hợp mặc hàng ngày",
      "Sản xuất tại Việt Nam"
    ]
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = sampleProducts.find((p) => p.id === parseInt(id));

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.images[0]);

  if (!product) return <h2>Không tìm thấy sản phẩm</h2>;

  const handleSizeClick = (size) => {
    setSelectedSize(selectedSize === size ? null : size);
  };

  const handleQtyChange = (type) => {
    if (type === "increase") setQuantity((prev) => prev + 1);
    else if (type === "decrease" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="detail-product-wrapper">
      {/* --- Ảnh sản phẩm --- */}
      <div className="detail-product-image">
        <div className="product-thumbnails">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              className={`thumbnail-img ${selectedImage === img ? "active" : ""}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        <div className="main-image">
          <img src={selectedImage} alt="Ảnh chính" />
        </div>
      </div>

      {/* --- Thông tin sản phẩm --- */}
      <div className="detail-product-info">
        <h1 className="detail-product-title">{product.name}</h1>

        <div className="detail-product-rating">
          ★ 4.8 <span>(1.257 đánh giá)</span>
        </div>

        <div className="detail-product-price">
          {product.price}đ
          <span className="detail-product-old-price">{product.oldPrice}đ</span>
          <span style={{ color: "blue", marginLeft: 8 }}>{product.discount}</span>
        </div>

        <div>🚚 Freeship đơn trên 200K</div>
        <div>🎁 Mã giảm giá: <strong>Giảm 10%</strong></div>

        <div className="detail-product-color-label">Màu sắc:</div>
        <div className="detail-product-color-options">
          {product.colors.map((color, index) => (
            <span
              key={index}
              className="detail-product-color-dot"
              style={{
                backgroundColor: color,
                border: selectedColor === color ? "2px solid black" : "1px solid #ccc"
              }}
              onClick={() => setSelectedColor(color)}
            ></span>
          ))}
        </div>

        <div className="detail-product-size-label">Kích thước Áo:</div>
        <div className="detail-product-sizes">
          {product.sizes.map((size) => (
            <div
              key={size}
              className={`detail-product-size-option ${selectedSize === size ? "selected" : ""}`}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </div>
          ))}
        </div>

        {/* --- Nút số lượng và giỏ hàng gộp chung --- */}
        <div className="detail-product-actions">
  <div className="pd-qty-control">
    <button onClick={() => handleQtyChange("decrease")}>-</button>
    <span>{quantity}</span>
    <button onClick={() => handleQtyChange("increase")}>+</button>
  </div>
  <button className="detail-product-buy-btn">
    <img src="/assets/icons/icon-cart.svg" alt="cart" />
    {selectedSize ? "Thêm vào giỏ hàng" : "Chọn kích thước"}
  </button>
</div>

      </div>
    </div>
  );
};

export default ProductDetail;
