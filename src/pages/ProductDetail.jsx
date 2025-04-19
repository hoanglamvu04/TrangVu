import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProductDetail.css";
import ProductCard from "../components/ProductCard";
import reviews from "../data/reviews";
import ProductDescription from "../components/ProductDescription";

const API_URL = "http://localhost:5000";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [details, setDetails] = useState([]);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);  

  const [selectedStar, setSelectedStar] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterImage, setFilterImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // 1) fetch product + all details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy về tất cả products
        const resProduct = await axios.get(`${API_URL}/api/products`);
        const all = resProduct.data;
        setAllProducts(all);

        // Tìm product hiện tại
        const found = all.find((p) => p.code === id || p._id === id);
        if (!found) return;
        setProduct(found);

        // Lấy chi tiết của product đó
        const resDetail = await axios.get(
          `${API_URL}/api/product-details/${found.code}`
        );
        const detailList = resDetail.data;
        setDetails(detailList);

        // Thiết lập ảnh mặc định
        const imgFull = found.image.startsWith("http")
          ? found.image
          : `${API_URL}${found.image}`;
        setSelectedImage(imgFull);

        // reset chọn màu/size/qty
        setSelectedColor("");
        setSelectedSize(null);
        setQuantity(1);
        setStock(0);

        setSelectedStar(null);
        setSortOrder("desc");
        setFilterImage("");
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, [id]);

  // 2) mỗi khi chọn color hoặc size => tính stock của combo đó
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const d = details.find(
        (x) => x.colorCode === selectedColor && x.size === selectedSize
      );
      setStock(d?.quantity || 0);

      // nếu bạn vẫn muốn gắn lên product.quantity
      setProduct((prev) =>
        prev ? { ...prev, quantity: d?.quantity || 0 } : prev
      );
    } else {
      setStock(0);
      setProduct((prev) =>
        prev ? { ...prev, quantity: 0 } : prev
      );
    }
  }, [selectedColor, selectedSize, details]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStar, filterImage, sortOrder]);

  if (!product) return <h2>Không tìm thấy sản phẩm</h2>;

  // Unique màu
  const uniqueColors = [];
  const seen = new Set();
  details.forEach((d) => {
    if (!seen.has(d.colorCode)) {
      seen.add(d.colorCode);
      uniqueColors.push({
        code: d.colorCode,
        name: d.colorName,
        image: d.image
          ? `${API_URL}${d.image}`
          : `${API_URL}${product.image}`,
      });
    }
  });

  // cấc size chỉ của màu chọn
  const availableSizes = details
    .filter((d) => d.colorCode === selectedColor)
    .map((d) => d.size);

  // stock từng size
  const sizeStock = {};
  details.forEach((d) => {
    if (d.colorCode === selectedColor) {
      sizeStock[d.size] = d.quantity;
    }
  });

  const getSelectedColorName = () =>
    uniqueColors.find((c) => c.code === selectedColor)?.name || "";

  // main image theo màu
  const mainImage = selectedColor
    ? uniqueColors.find((c) => c.code === selectedColor)?.image ||
      `${API_URL}${product.image}`
    : `${API_URL}${product.image}`;

  // xử lý review (giữ nguyên)
  const filteredReviews = reviews
    .filter((r) => (selectedStar ? r.rating === selectedStar : true))
    .filter((r) =>
      filterImage === "hasImage"
        ? r.images?.length > 0
        : filterImage === "noImage"
        ? r.images?.length === 0
        : true
    )
    .sort((a, b) =>
      sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating
    );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  const handleSizeClick = (size) => {
    if (sizeStock[size] > 0) {
      setSelectedSize(size === selectedSize ? null : size);
    }
  };

  const handleQtyChange = (type) => {
    setQuantity((prev) =>
      type === "increase"
        ? prev + 1
        : prev > 1
        ? prev - 1
        : 1
    );
  };

  // gợi ý sản phẩm
  const suggestedProducts = allProducts
    .filter(
      (p) =>
        p.code !== product.code &&
        p.category?.toString() === product.category?.toString()
    )
    .slice(0, 4);

  return (
    <div className="detail-product-wrapper">
      {/* ảnh */}
      <div className="detail-product-image">
        <div className="product-thumbnails">
          {[mainImage].map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              className={`thumbnail-img ${
                selectedImage === img ? "active" : ""
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        <div className="main-image">
          <img src={selectedImage} alt="Ảnh chính" />
        </div>
      </div>

      {/* info */}
      <div className="detail-product-info">
        <h1 className="detail-product-title">{product.name}</h1>

        {/* hiển thị stock theo combo */}
        <div className="detail-product-rating">
          Số lượng sản phẩm: {stock}
        </div>

        {/* giá */}
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

        <div>🚚 Giao hàng nhanh trong 1-3 ngày tại TP.HCM và Hà Nội</div>
        <div>💡 Đổi trả dễ dàng trong 15 ngày</div>

        {/* màu */}
        <div className="modal-section no-margin-bot">
          <label>
            Màu sắc: <strong>{getSelectedColorName()}</strong>
          </label>
          <div className="color-options">
            {uniqueColors.map((color, idx) => {
              const isWhite = color.code.toLowerCase() === "#ffffff";
              return (
                <div key={idx} className="color-wrapper">
                  <span
                    className={`color-dot ${
                      isWhite ? "white" : ""
                    } ${
                      selectedColor === color.code ? "active" : ""
                    }`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => {
                      if (selectedColor === color.code) {
                        setSelectedColor("");
                        setSelectedImage(`${API_URL}${product.image}`);
                      } else {
                        setSelectedColor(color.code);
                        setSelectedImage(color.image);
                        setSelectedSize(null);
                      }
                    }}
                  ></span>
                </div>
              );
            })}
          </div>
        </div>

        {/* size */}
        <div className="detail-product-size-label">Kích thước:</div>
        <div className="detail-product-sizes">
          {availableSizes.map((size) => (
            <div
              key={size}
              className={`detail-product-size-option 
                ${selectedSize === size ? "selected" : ""} 
                ${sizeStock[size] === 0 ? "out-of-stock" : ""}`}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </div>
          ))}
        </div>

        {/* qty + button */}
        <div className="detail-product-actions">
          <div className="pd-qty-control">
            <button onClick={() => handleQtyChange("decrease")}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQtyChange("increase")}>+</button>
          </div>
          <button className="detail-product-buy-btn">
            <img
              src="/assets/icons/icon-cart.svg"
              alt="cart"
              className="cart-icon"
            />
            {selectedSize ? "Thêm vào giỏ hàng" : "Chọn kích thước"}
          </button>
        </div>
      </div>

      {/* Mô tả */}
      <ProductDescription product={product} />

      {/* Gợi ý */}
      <div className="suggested-products">
        <h2 className="suggested-title">GỢI Ý SẢN PHẨM</h2>
        <div className="suggested-grid">
          {suggestedProducts.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
