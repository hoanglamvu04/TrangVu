import React, { useState, useEffect } from "react"; 
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
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.TIM.4_39_35.jpg"
    ],
    description: "Chất liệu Cotton 220GSM, mềm mịn, thoáng mát.",
    price: "161.000",
    oldPrice: "179.000",
    discount: "-10%",
    colors: ["#E3DCC9", "#C1C2C2", "#1E3A8A", "#566E5A", "#000000", "#ffffff"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"]
  }
];

const reviews = [
  {
    id: 1,
    name: "Trần Tuấn Kiệt",
    date: "07.12.2024",
    rating: 5,
    comment: "Sản phẩm đẹp, giao hàng nhanh chóng, chính sách sau bán hàng tốt",
    hasReply: false,
    images: []
  },
  {
    id: 2,
    name: "An Huy Hoàng",
    date: "24.09.2024",
    rating: 5,
    comment: "Chiếc tuyệt nhất",
    hasReply: true,
    reply: "Cảm ơn anh đã tin tưởng ủng hộ sản phẩm bên em!",
    images: []
  },
  {
    id: 3,
    name: "Việt Vũ",
    date: "15.08.2024",
    rating: 5,
    comment: "Chất liệu vải Excool mặc rất thoải mái. Thấm hút mồ hôi tốt.",
    hasReply: false,
    images: ["https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.TIM.4_39_35.jpg"]
  },
  {
    id: 4,
    name: "Đoàn Thảo",
    date: "23.02.2024",
    rating: 2,
    comment: "Giao hàng chậm hơn dự kiến",
    hasReply: true,
    reply: "Chúng tôi xin lỗi vì sự bất tiện này và sẽ cải thiện quy trình vận chuyển.",
    images: []
  },
  {
    id: 5,
    name: "Hợp Lực",
    date: "10.12.2024",
    rating: 3,
    comment: "Sản phẩm tốt, chăm sóc khách hàng tận tình khi đổi hàng",
    hasReply: false,
    images: [
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.TIM.4_39_35.jpg",
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2024/AT.220.TIM.4_39_35.jpg"
    ]
  },
  {
    id: 6,
    name: "Ngọc Mai",
    date: "02.01.2025",
    rating: 4,
    comment: "Áo mặc dễ chịu, nhưng hơi rộng hơn size thường",
    hasReply: false,
    images: []
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = sampleProducts.find((p) => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(product?.images[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Đánh giá
  const [selectedStar, setSelectedStar] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterImage, setFilterImage] = useState(""); // "", "hasImage", "noImage"
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStar, filterImage, sortOrder]);
  if (!product) return <h2>Không tìm thấy sản phẩm</h2>;

  const filteredReviews = reviews
    .filter((r) => (selectedStar ? r.rating === selectedStar : true))
    .filter((r) =>
      filterImage === "hasImage"
        ? r.images?.length > 0
        : filterImage === "noImage"
        ? r.images?.length === 0
        : true
    )
    .sort((a, b) => (sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating));

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  const handleSizeClick = (size) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleQtyChange = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };
  
  return (
    <div className="detail-product-wrapper">
      {/* === Ảnh & Thông tin === */}
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

      <div className="detail-product-info">
        <h1 className="detail-product-title">{product.name}</h1>
        <div className="detail-product-rating">★ 4.8 <span>(1.257 đánh giá)</span></div>
        <div className="detail-product-price">
          {product.price}đ
          <span className="detail-product-old-price">{product.oldPrice}đ</span>
          <span style={{ color: "blue", marginLeft: 8 }}>{product.discount}</span>
        </div>
        <div>🚚 Freeship đơn trên 200K</div>
        <div>🎁 Mã giảm giá: <strong>Giảm 10%</strong></div>

        <div className="detail-product-color-label">Màu sắc:</div>
        <div className="detail-product-color-options">
          {product.colors.map((color, idx) => (
            <span
              key={idx}
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

        <div className="detail-product-actions">
          <div className="pd-qty-control">
            <button onClick={() => handleQtyChange("decrease")}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQtyChange("increase")}>+</button>
          </div>
          <button className="detail-product-buy-btn">
            <img src="/assets/icons/icon-cart.svg" alt="cart" className="cart-icon" />
            {selectedSize ? "Thêm vào giỏ hàng" : "Chọn kích thước"}
          </button>
        </div>
      </div>

      {/* === Đánh giá === */}
      <div className="review-section">
        <h2 className="review-heading">ĐÁNH GIÁ SẢN PHẨM</h2>
        <div className="review-layout">
          <div className="review-sidebar">
            <input type="text" placeholder="Tìm kiếm đánh giá" className="review-search" />
            <div className="review-filter">
  <p>Phân loại xếp hạng</p>
  {[5, 4, 3, 2, 1].map((stars) => (
    <label key={stars} className="review-star-filter">
      <input
        type="checkbox"
        checked={selectedStar === stars}
        onChange={() => {
          setSelectedStar((prev) => (prev === stars ? null : stars));
          setCurrentPage(1); // reset về trang đầu khi lọc
        }}
      />
      <span className="star-icons">
        {"⭐".repeat(stars)}
        <span className="star-count">
          ({reviews.filter((r) => r.rating === stars).length})
        </span>
      </span>
    </label>
  ))}
</div>



            <div className="review-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={filterImage === "hasImage"}
                  onChange={() => setFilterImage(filterImage === "hasImage" ? "" : "hasImage")}
                />{" "}
                Kèm hình ảnh
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filterImage === "noImage"}
                  onChange={() => setFilterImage(filterImage === "noImage" ? "" : "noImage")}
                />{" "}
                Không kèm hình ảnh
              </label>
            </div>
          </div>

          <div className="review-content">
            <div className="review-summary">
              <h3>4.8⭐</h3>
              <p>Dựa trên {filteredReviews.length} đánh giá từ khách hàng</p>
            </div>
            <div className="review-sorting">
              <span>Hiển thị đánh giá {startIndex + 1}-{Math.min(startIndex + reviewsPerPage, filteredReviews.length)}</span>
              <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                <option value="desc">Đánh giá: Cao đến thấp</option>
                <option value="asc">Đánh giá: Thấp đến cao</option>
              </select>
            </div>

            {paginatedReviews.length > 0 ? (
              <>
                <div className="review-list">
                  {paginatedReviews.map((item) => (
                    <div key={item.id} className="review-item">
                      <p className="review-user"><strong>{item.name}</strong> • {item.date}</p>
                      <div className="review-stars">{"⭐".repeat(item.rating)}</div>
                      <p>{item.comment}</p>
                      {item.images?.length > 0 && (
                        <div className="review-images" style={{ display: "flex", gap: 10 }}>
                          {item.images.map((img, idx) => (
                            <img key={idx} src={img} alt="Ảnh đánh giá" style={{ width: 60, height: 60, borderRadius: 4 }} />
                          ))}
                        </div>
                      )}
                      {item.hasReply && (
                        <div className="review-reply" style={{ background: "#f3f4f6", padding: 12, borderRadius: 8, marginTop: 10 }}>
                          <strong>Phản hồi từ COOLMATE</strong>
                          <p>{item.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="review-pagination" style={{ textAlign: "center", marginTop: 20 }}>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    <span style={{ margin: "0 10px" }}>{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="review-empty">
                <p>Chưa có đánh giá</p>
                <em>Hãy mua và đánh giá sản phẩm này nhé!</em>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
