import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProductDetail.css";
import ProductCard from "../components/ProductCard";
import ProductDescription from "../components/ProductDescription";
import { useCart } from "../contexts/CartContext";
import ReviewList from "../components/ReviewList";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const toAbsUrl = (u) => (u && /^https?:\/\//i.test(u) ? u : u ? `${API_URL}${u}` : "");

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

  const [isAdmin, setIsAdmin] = useState(false);
  const { addToCart } = useCart();

  // Load sản phẩm + chi tiết
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await axios.get(`${API_URL}/api/products`);
        const all = resProduct.data || [];
        setAllProducts(all);

        const found = all.find((p) => p.code === id || p._id === id);
        if (!found) {
          setProduct(null);
          setDetails([]);
          setSelectedImage("");
          return;
        }

        setProduct(found);

        const resDetail = await axios.get(`${API_URL}/api/product-details/${found.code}`);
        const det = resDetail.data || [];
        setDetails(det);

        setSelectedImage(toAbsUrl(found.image));
        setSelectedColor("");
        setSelectedSize(null);
        setQuantity(1);
        setStock(0);

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    fetchData();
  }, [id]);

  // Check admin
  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (!stored) return setIsAdmin(false);
    const parsed = JSON.parse(stored);
    const code = parsed?.customerCode;
    if (!code) return setIsAdmin(false);
    axios
      .get(`${API_URL}/api/admin/check-by-code/${code}`)
      .then((res) => setIsAdmin(!!res.data?.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  // Cập nhật tồn khi đổi size/màu
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const d = details.find((x) => x.colorCode === selectedColor && x.size === selectedSize);
      setStock(d?.quantity || 0);
    } else {
      setStock(0);
    }
  }, [selectedColor, selectedSize, details]);

  /* ====== Hooks tính toán (luôn gọi, KHÔNG đặt sau return) ====== */

  // Map ảnh theo màu
  const colorMap = useMemo(() => {
    const map = {};
    for (const d of details) {
      const code = d.colorCode;
      if (!code) continue;
      if (!map[code]) map[code] = { name: d.colorName, images: new Set() };

      // schema mới: images[]; cũ: image
      const arr = Array.isArray(d.images) ? d.images : d.image ? [d.image] : [];
      arr.forEach((rel) => rel && map[code].images.add(toAbsUrl(rel)));
    }
    Object.keys(map).forEach((k) => (map[k].images = Array.from(map[k].images)));
    return map;
  }, [details]);

  // Danh sách màu
  const uniqueColors = useMemo(
    () => Object.entries(colorMap).map(([code, v]) => ({ code, name: v.name })),
    [colorMap]
  );

  // Ảnh phụ (thumbnails) theo màu
  const productImageAbs = toAbsUrl(product?.image);
  const thumbnails = useMemo(() => {
    if (selectedColor && colorMap[selectedColor]) {
      const list = colorMap[selectedColor].images || [];
      if (list.length) return list;
    }
    return productImageAbs ? [productImageAbs] : [];
  }, [selectedColor, colorMap, productImageAbs]);

  // Tên màu
  const selectedColorName = selectedColor ? colorMap[selectedColor]?.name || "" : "";

  // Size theo màu
  const availableSizes = useMemo(() => {
    return selectedColor
      ? details.filter((d) => d.colorCode === selectedColor).map((d) => d.size)
      : [];
  }, [details, selectedColor]);

  // Tồn theo size của màu
  const sizeStock = useMemo(() => {
    const obj = {};
    details.forEach((d) => {
      if (d.colorCode === selectedColor) obj[d.size] = d.quantity;
    });
    return obj;
  }, [details, selectedColor]);

  const totalAll = useMemo(
    () => details.reduce((s, d) => s + (Number(d.quantity) || 0), 0),
    [details]
  );

  // Chọn màu → set ảnh chính là thumbnail đầu tiên
  const onSelectColor = (colorCode) => {
    if (selectedColor === colorCode) {
      setSelectedColor("");
      setSelectedSize(null);
      setSelectedImage(productImageAbs);
      return;
    }
    setSelectedColor(colorCode);
    setSelectedSize(null);
    const imgs = colorMap[colorCode]?.images || [];
    setSelectedImage(imgs[0] || productImageAbs);
  };

  const handleSizeClick = (size) => {
    if (sizeStock[size] > 0) setSelectedSize(size === selectedSize ? null : size);
  };

  const handleQtyChange = (type) => {
    setQuantity((prev) => {
      if (type === "increase") {
        if (selectedSize && stock > 0 && prev + 1 > stock) return prev;
        return prev + 1;
      }
      return prev > 1 ? prev - 1 : 1;
    });
  };

  const suggestedProducts = useMemo(
    () =>
      (allProducts || [])
        .filter((p) => p.code !== product?.code && p.category?.toString() === product?.category?.toString())
        .slice(0, 4),
    [allProducts, product]
  );

  const qtyLabel = selectedSize ? "Số lượng sản phẩm" : "Tổng số lượng sản phẩm";
  const qtyValue = selectedSize ? stock : totalAll;

  let buyBtnText = "Thêm vào giỏ hàng";
  if (!selectedColor) buyBtnText = "Chọn màu sắc";
  else if (!selectedSize) buyBtnText = "Chọn kích thước";
  else if (selectedSize && stock === 0) buyBtnText = "Hết hàng";
  const buyDisabled = !selectedColor || !selectedSize || stock === 0;

  /* ====== Render ====== */

  // Nếu chưa có product (đang tải / không tìm thấy), vẫn đã gọi mọi hook phía trên → OK
  if (!product) {
    return (
      <div className="detail-product-wrapper">
        <div style={{ padding: 24 }}>Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="detail-product-wrapper">
      {/* LEFT: Thumbnails + Main image */}
      <div className="detail-product-image">
        <div className="product-thumbnails">
          {thumbnails.map((img, idx) => (
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
          {selectedImage ? (
            <img src={selectedImage} alt="Ảnh chính" />
          ) : (
            <div style={{ width: "100%", height: 300, background: "#f5f5f5" }} />
          )}
        </div>
      </div>

      {/* RIGHT: Info */}
      <div className="detail-product-info">
        <h1 className="detail-product-title">{product.name}</h1>

        <div className="detail-product-rating">
          {qtyLabel}: {qtyValue}
        </div>

        {selectedSize && stock === 0 && (
          <div style={{ color: "red", marginBottom: "10px" }}>Sản phẩm hết hàng</div>
        )}

        <div className="product-prices">
          {product.finalPrice && (
            <span className="current-price">{Number(product.finalPrice).toLocaleString()}đ</span>
          )}
          {product.originalPrice && product.discount > 0 && (
            <span className="old-price">{Number(product.originalPrice).toLocaleString()}đ</span>
          )}
          {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
        </div>

        <div>🚚 Giao hàng nhanh trong 1-3 ngày tại TP.HCM và Hà Nội</div>
        <div>💡 Đổi trả dễ dàng trong 15 ngày</div>

        {/* Chọn màu */}
        <div className="modal-section no-margin-bot">
          <label>
            Màu sắc: <strong>{selectedColorName}</strong>
          </label>
          <div className="color-options">
            {uniqueColors.map((c) => {
              const isWhite = c.code?.toLowerCase() === "#ffffff";
              return (
                <div key={c.code} className="color-wrapper">
                  <span
                    className={`color-dot ${isWhite ? "white" : ""} ${
                      selectedColor === c.code ? "active" : ""
                    }`}
                    style={{ backgroundColor: c.code }}
                    onClick={() => onSelectColor(c.code)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Chọn size */}
        <div className="detail-product-size-label">Kích thước:</div>
        {!selectedColor ? (
          <div style={{ marginBottom: 12, fontStyle: "italic", color: "#888" }}>
            Vui lòng chọn màu sắc để xem kích thước
          </div>
        ) : (
          <div className="detail-product-sizes">
            {availableSizes.map((size) => (
              <div
                key={size}
                className={`detail-product-size-option ${
                  selectedSize === size ? "selected" : ""
                } ${sizeStock[size] === 0 ? "out-of-stock" : ""}`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </div>
            ))}
          </div>
        )}

        {/* Hành động */}
        <div className="detail-product-actions">
          <div className="pd-qty-control">
            <button onClick={() => handleQtyChange("decrease")}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQtyChange("increase")}>+</button>
          </div>

          <button
            className="detail-product-buy-btn"
            disabled={buyDisabled}
            onClick={() => {
              if (buyDisabled) return;
              addToCart({
                productCode: product.code,
                name: product.name,
                selectedColor,
                selectedSize,
                quantity,
                price: product.finalPrice,
                image: selectedImage,
              });
              alert("Đã thêm vào giỏ!");
            }}
          >
            <img src="/assets/icons/icon-cart.svg" alt="cart" className="cart-icon" />
            {buyBtnText}
          </button>
        </div>
      </div>

      {/* Mô tả & đánh giá */}
      <ProductDescription product={product} />

      <div className="product-reviews">
        <ReviewList productCode={product.code} isAdmin={isAdmin} />
      </div>

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
