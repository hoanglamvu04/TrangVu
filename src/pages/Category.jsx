import React from "react";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import "../styles/CategoryPage.css";
import products from "../data/products"; 

const Category = () => {
  return (
    <div className="category-page">
      <div className="category-container">
        <FilterSidebar />
        <div className="product-section">
          <h2 className="category-title">SẢN PHẨM NỔI BẬT 0</h2>
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