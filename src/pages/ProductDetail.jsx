import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetail.css";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import reviews from "../data/reviews";
import ProductDescription from "../components/ProductDescription";


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [selectedStar, setSelectedStar] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterImage, setFilterImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Cập nhật sản phẩm mỗi khi id thay đổi
  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
    if (foundProduct) {
      setSelectedImage(foundProduct.images?.[0] || foundProduct.image);
      setSelectedColor(foundProduct.colors?.[0]?.code || "");
      setSelectedSize(null);
      setQuantity(1);
    }

    setSelectedStar(null);
    setSortOrder("desc");
    setFilterImage("");
    setCurrentPage(1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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
    if (product.sizeStock[size] > 0) {
      setSelectedSize(size === selectedSize ? null : size);
    }
  };

  const handleQtyChange = (type) => {
    setQuantity((prev) => (type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const getSuggestedProducts = (currentProduct, productList) => {
    const sameCategory = productList.filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.category === currentProduct.category &&
        (parseFloat(p.rating) >= 4.5 || p.sold >= 100)
    );
    return sameCategory.sort(() => 0.5 - Math.random()).slice(0, 4);
  };

  const getSelectedColorName = () => {
    return product.colors?.find((color) => color.code === selectedColor)?.name || "";
  };

  const suggestedProducts = getSuggestedProducts(product, products);

  return (
    <div className="detail-product-wrapper">
      <div className="detail-product-image">
        <div className="product-thumbnails">
          {product.images?.map((img, idx) => (
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
        <div className="detail-product-rating">
          ★ {product.rating} <span>({product.reviews} đánh giá)</span>
        </div>
        <div className="product-prices">
          {product.currentPrice && <span className="current-price">{product.currentPrice}đ</span>}
          {product.oldPrice && <span className="old-price">{product.oldPrice}đ</span>}
          {product.discount && <span className="discount-badge">-{product.discount}%</span>}
        </div>

        <div>🚚 Giao hàng nhanh trong 1-3 ngày tại TP.HCM và Hà Nội</div>
        <div>💡 Đổi trả dễ dàng trong 15 ngày</div>

        <div className="modal-section no-margin-bot">
          <label>
            Màu sắc: <strong>{getSelectedColorName()}</strong>
          </label>
          <div className="color-options">
            {product.colors?.map((color, idx) => {
              const isWhite = color.code.toLowerCase() === "#ffffff" || color.name.toLowerCase().includes("trắng");
              return (
                <div key={idx} className="color-wrapper">
                  <span
                    className={`color-dot ${isWhite ? "white" : ""} ${selectedColor === color.code ? "active" : ""}`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => {
                      if (selectedColor === color.code) {
                        setSelectedColor("");
                        setSelectedImage(product.images?.[0] || product.image);
                      } else {
                        setSelectedColor(color.code);
                        const img = product.colorImages?.[color.code] || product.image;
                        setSelectedImage(img);
                      }
                    }}
                  ></span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="detail-product-size-label">Kích thước:</div>
        <div className="detail-product-sizes">
          {product.sizes?.map((size) => (
            <div
              key={size}
              className={`detail-product-size-option 
                ${selectedSize === size ? "selected" : ""} 
                ${product.sizeStock[size] === 0 ? "out-of-stock" : ""}`}
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

      <ProductDescription product={product} />
      
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
                      setCurrentPage(1);
                    }}
                  />
                  <span className="star-icons">
                    {"⭐".repeat(stars)}
                    <span className="star-count">({reviews.filter((r) => r.rating === stars).length})</span>
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
              <h3>{product.rating}⭐</h3>
              <p>Dựa trên {filteredReviews.length} đánh giá từ khách hàng</p>
            </div>
            <div className="review-sorting">
              <span>
                Hiển thị {startIndex + 1}-{Math.min(startIndex + reviewsPerPage, filteredReviews.length)}
              </span>
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
                      <p className="review-user">
                        <strong>{item.name}</strong> • {item.date}
                      </p>
                      <div className="review-stars">{"⭐".repeat(item.rating)}</div>
                      <p>{item.comment}</p>
                      {item.images?.length > 0 && (
                        <div className="review-images" style={{ display: "flex", gap: 10 }}>
                          {item.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Ảnh đánh giá"
                              style={{ width: 100, height: 100, borderRadius: 4 }}
                            />
                          ))}
                        </div>
                      )}
                      {item.hasReply && (
                        <div
                          className="review-reply"
                          style={{ background: "#f3f4f6", padding: 12, borderRadius: 8, marginTop: 10 }}
                        >
                          <strong>Phản hồi từ COOLMATE</strong>
                          <p>{item.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="review-pagination" style={{ textAlign: "center", marginTop: 20 }}>
                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                      &lt;
                    </button>
                    <span style={{ margin: "0 10px" }}>
                      {currentPage} / {totalPages}
                    </span>
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

      {/* === GỢI Ý SẢN PHẨM === */}
      <div className="suggested-products">
        <h2 className="suggested-title">GỢI Ý SẢN PHẨM</h2>
        <div className="suggested-grid">
          {suggestedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
