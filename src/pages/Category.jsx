import React from "react";
import ProductCard from "../components/ProductCard"; 
import FilterSidebar from "../components/FilterSidebar";
import "../styles/CategoryPage.css";

const products = [
  {
    id: 1,
    name: "Áo Thun Nam Cotton 220GSM OMGGGGGGG",
    image: "/assets/images/featured-products/polo.png",
    rating: "4.8",
    reviews: "189",
    colors: ["#E3DCC9", "#C1C2C2", "#1E3A8A", "#566E5A"],
    currentPrice: "161.000",
    oldPrice: "179.000",
    discount: "-10",
  },
  {
    id: 2,
    name: "Áo dài tay thể thao 1699",
    image: "/assets/images/featured-products/polo.png",
    rating: "4.8",
    reviews: "5",
    colors: ["#EDEDED", "#464646", "#0C0C0C", "#14213D", "#374151"],
    currentPrice: "188.000",
    oldPrice: "269.000",
    discount: "-30",
  },
  {
    id: 3,
    name: "Áo thun Nam Thể thao Phối bo cổ",
    image: "/assets/images/featured-products/shorts.png",
    rating: "4.9",
    reviews: "8",
    colors: ["#000000", "#D50000", "#2A6F97", "#C4C4C4"],
    currentPrice: "249.000",
    oldPrice: null,
    discount: null,
  },
  {
    id: 4,
    name: "Áo thun nam Cotton Compact",
    image: "/assets/images/women/sweet-chilling.png",
    rating: "4.8",
    reviews: "1.257",
    colors: ["#000000", "#777777", "#F5F5F5", "#2C2C2C"],
    currentPrice: "219.000",
    oldPrice: "259.000",
    discount: "-15",
  },
];

const Category = () => {
  return (
    <div className="category-page">
      <div className="category-container">
        {/* Bộ lọc sản phẩm bên trái */}
        <FilterSidebar />

        {/* Danh sách sản phẩm bên phải */}
        <div className="product-section">
          <h2 className="category-title">SẢN PHẨM NỔI BẬT</h2>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
