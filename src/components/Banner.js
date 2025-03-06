import React from "react";
import "../styles/Banner.css"; 

const Banner = () => {
  return (
    <div className="banner-container">
      <div className="banner-grid">
        {/* Ảnh lớn bên trái */}
        <div className="banner-large">
        <img src="/assets/images/banner1.1.jpg" alt="Banner 1" className="banner-item" />
        </div>

        {/* Cột chứa 2 ảnh nhỏ */}
        <div className="banner-small">
        <img src="/assets/images/banner1.jpg" alt="Banner 1" className="banner-item" />
        <img src="/assets/images/banner1.jpg" alt="Banner 1" className="banner-item" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
