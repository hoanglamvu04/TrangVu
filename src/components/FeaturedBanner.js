import React from "react";
import "../styles/FeaturedBanner.css";

const FeaturedBanner = () => {
  return (
    <div className="featured-banner">
      <img src="/featured-banner.png" alt="Sản phẩm nổi bật" className="featured-banner-image" />
      <div className="featured-banner-content">
        <h2>SẢN PHẨM NỔI BẬT</h2>
        <p>Những sản phẩm được yêu thích nhất hiện nay.</p>
        <a href="#" className="explore-button">KHÁM PHÁ NGAY →</a>
      </div>
    </div>
  );
};

export default FeaturedBanner;
