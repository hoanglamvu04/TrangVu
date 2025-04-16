import React from "react";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import useProducts from "../hooks/useProducts";
import "../styles/CategoryPage.css";

const Category = () => {
  const { products, loading, error } = useProducts();

  return (
    <div className="category-page">
      <div className="category-container">
        <FilterSidebar />
        <div className="product-section">
          <h2 className="category-title">DANH SÁCH SẢN PHẨM</h2>
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
