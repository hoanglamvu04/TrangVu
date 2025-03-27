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
  const reviews = [
    {
      name: "Trần Tuấn Kiệt",
      date: "07.12.2024",
      content: "Sản phẩm đẹp, giao hàng nhanh chóng, chính sách sau bán hàng tốt",
      stars: 5
    },
    {
      name: "An Huy Hoàng",
      date: "24.09.2024",
      content: "Chiếc tuyệt nhất",
      stars: 5
    },
    {
      name: "Việt Vũ",
      date: "15.08.2024",
      content:
        "Các sản phẩm chất liệu vải Excool mặc rất thoải mái. Thấm hút mồ hôi tốt, co dãn vừa đủ...",
      stars: 5
    }
  ];
  
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
      <div className="product-desc-section">
      <h2 className="section-title">MÔ TẢ SẢN PHẨM</h2>
  <div className="desc-left">
    <div className="desc-icons">
      <div className="icon-item">
        <img src="/assets/icons/absorb.png" alt="Bền bỉ" />
        <p>Bền bỉ</p>
      </div>
      <div className="icon-item">
        <img src="/assets/icons/comfort.png" alt="Thoải mái" />
        <p>Thoải mái</p>
      </div>
      <div className="icon-item">
        <img src="/assets/icons/comfort.png" alt="Vừa vặn" />
        <p>Vừa vặn</p>
      </div>
    </div>

    <div className="desc-info">
      <div>
        <strong>CHẤT LIỆU</strong>
        <p>100% Cotton<br />Định lượng vải 220gsm</p>
      </div>
      <div>
        <strong>KIỂU DÁNG</strong>
        <p>Regular fit<br />
          Hình in được thiết kế bởi Mr. An Nguyễn (Ryan Nguyen)<br />
          Mẫu nữ: 1m68 - 50 kg - mặc size S<br />
          Mẫu nam: 1m73 - 75 kg - mặc size L
        </p>
      </div>
      <div>
        <strong>PHÙ HỢP</strong>
        <p>Mặc hàng ngày</p>
      </div>
    </div>

    <p className="made-in">* Proudly Made In Vietnam</p>
  </div>

  <div className="desc-right">
    <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.TIM.4_39_35.jpg" />
  </div>
</div>
<div className="review-section">
  <h2 className="review-heading">ĐÁNH GIÁ SẢN PHẨM</h2>

  <div className="review-layout">
    {/* Sidebar bộ lọc */}
    <div className="review-sidebar">
      <input type="text" placeholder="Tìm kiếm đánh giá" className="review-search" />

      <div className="review-filter">
        <p>Phân loại xếp hạng</p>
        {[5, 4, 3, 2, 1].map((stars) => (
          <label key={stars}>
            <input type="checkbox" />
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </label>
        ))}
      </div>

      <div className="review-checkbox">
        <label>
          <input type="checkbox" checked />
          Các review đều đến từ khách hàng đã thực sự mua hàng
        </label>
      </div>

      <div className="review-checkbox">
        <label>
          <input type="checkbox" />
          Đã phản hồi
        </label>
        <label>
          <input type="checkbox" />
          Chỉ có hình ảnh
        </label>
      </div>
    </div>

    {/* Danh sách đánh giá */}
    <div className="review-content">
      <div className="review-summary">
        <h3>5★</h3>
        <p>Dựa trên 3 đánh giá từ khách hàng</p>
      </div>

      <div className="review-sorting">
        <span>Hiển thị đánh giá 1-3</span>
        <select>
          <option>Sắp xếp</option>
        </select>
      </div>

      <div className="review-list">
        {reviews.map((item, idx) => (
          <div key={idx} className="review-item">
            <p className="review-user">
              <strong>{item.name}</strong> • {item.date}
            </p>
            <div className="review-stars">★★★★★</div>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default ProductDetail;
