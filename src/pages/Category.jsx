import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import "../styles/CategoryPage.css";

// Sử dụng biến môi trường cho API_URL
const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

const Category = () => {
  const { categoryCode } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/category/${categoryCode}`);
        setProducts(res.data);
        setError("");
      } catch (err) {
        setError("Không thể tải sản phẩm.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryCode]);

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
          ) : products.length === 0 ? (
            <p>Không có sản phẩm nào trong danh mục này.</p>
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
