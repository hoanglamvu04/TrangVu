import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FeaturedBanner.css";
import ProductCard from "./ProductCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Xáo mảng và lấy tối đa n phần tử
function pickRandom(arr, n) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

export default function FeaturedBanner() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`, { signal: controller.signal });
        const all = Array.isArray(res.data) ? res.data : [];
        setFeaturedProducts(pickRandom(all, 4));
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Lỗi khi tải sản phẩm nổi bật:", err);
          setFeaturedProducts([]);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  return (
    <div>
      <div className="featured-banner">
        <img src="/featured-banner.png" alt="Sản phẩm nổi bật" className="featured-banner-image" />
        <div className="featured-banner-content">
          <h2>SẢN PHẨM NỔI BẬT</h2>
          <p>Những sản phẩm được yêu thích nhất hiện nay.</p>
          <button
            type="button"
            className="explore-button"
            onClick={() => window.scrollTo({ top: document.body.clientHeight, behavior: "smooth" })}
          >
            KHÁM PHÁ NGAY →
          </button>
        </div>
      </div>

      <div className="suggested-products">
        <h2 className="suggested-title">SẢN PHẨM NỔI BẬT</h2>
        <div className="suggested-grid">
          {loading ? (
            <p>Đang tải…</p>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((p) => <ProductCard key={p._id || p.code} product={p} />)
          ) : (
            <p>Hiện chưa có sản phẩm.</p>
          )}
        </div>
      </div>
    </div>
  );
}
