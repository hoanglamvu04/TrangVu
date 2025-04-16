import React, { useState } from "react";
import "../styles/Banner.css";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const largeImages = [
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m5184szf0klz56_xxhdpi",
    "https://cf.shopee.vn/file/vn-11134258-7ra0g-m8bm8vahff5z8c_xxhdpi",
    "https://cf.shopee.vn/file/vn-11134258-7ra0g-m85x5kqjfbla5e_xxhdpi"
  ];

  const smallImages = [
 "https://cf.shopee.vn/file/vn-11134258-7ra0g-m8ebw7jhjaro9e_xhdpi",
 "https://cf.shopee.vn/file/vn-11134258-7ra0g-m8ebw7jhjaro9e_xhdpi"
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? largeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === largeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="banner-container">
      <div className="banner-grid">
        {/* Ảnh lớn bên trái có điều hướng */}
        <div className="banner-large">
          <img
            src={largeImages[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            className="banner-item"
          />
          <button className="banner-arrow left" onClick={handlePrev}>
            ❮
          </button>
          <button className="banner-arrow right" onClick={handleNext}>
            ❯
          </button>
        </div>

        {/* Cột chứa 2 ảnh nhỏ bên phải */}
        <div className="banner-small">
          {smallImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Small Banner ${index + 1}`}
              className="banner-item"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
