import React, { useState } from "react";
import "../styles/FilterSidebar.css";
import { FaChevronDown } from "react-icons/fa";

const FilterSidebar = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);

  return (
    <div className="filter-sidebar">
      {/* Phù hợp với */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
          <span className="filter-title">Phù hợp với</span>
          <span className={`filter-arrow ${isCategoryOpen ? "open" : ""}`}>
            <FaChevronDown />
          </span>
        </div>
        {isCategoryOpen && (
          <div className="filter-options">
            <label><input type="radio" name="category" /> Mặc ở nhà</label>
            <label><input type="radio" name="category" /> Mặc hàng ngày</label>
            <label><input type="radio" name="category" /> Thể thao</label>
          </div>
        )}
      </div>

      {/* Kích cỡ */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setIsSizeOpen(!isSizeOpen)}>
          <span className="filter-title">Kích cỡ</span>
          <span className={`filter-arrow ${isSizeOpen ? "open" : ""}`}>
            <FaChevronDown />
          </span>
        </div>
        {isSizeOpen && (
          <div className="filter-options size-options">
            {["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
              <button key={size} className="size-btn">{size}</button>
            ))}
          </div>
        )}
      </div>

      {/* Màu sắc */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setIsColorOpen(!isColorOpen)}>
          <span className="filter-title">Màu sắc</span>
          <span className={`filter-arrow ${isColorOpen ? "open" : ""}`}>
            <FaChevronDown />
          </span>
        </div>
        {isColorOpen && (
          <div className="filter-options color-options">
            {["#000000", "#D50000", "#2A6F97", "#C4C4C4", "#FFFF00"].map((color) => (
              <div key={color} className="color-circle" style={{ backgroundColor: color }}></div>
            ))}
          </div>
        )}
      </div>

      {/* Chất liệu */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setIsMaterialOpen(!isMaterialOpen)}>
          <span className="filter-title">Chất liệu</span>
          <span className={`filter-arrow ${isMaterialOpen ? "open" : ""}`}>
            <FaChevronDown />
          </span>
        </div>
        {isMaterialOpen && (
          <div className="filter-options">
            <label><input type="checkbox" /> Cotton</label>
            <label><input type="checkbox" /> Polyester</label>
            <label><input type="checkbox" /> Modal</label>
            <label><input type="checkbox" /> Recycle</label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
