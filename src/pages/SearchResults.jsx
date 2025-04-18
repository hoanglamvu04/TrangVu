import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/ProductDetail.css"; 
import "../styles/search.css";

const API_URL = "http://localhost:5000";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredList = products.filter((p) =>
      p.name?.toLowerCase().includes(keyword)
    );
    setFiltered(filteredList);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [keyword, products]);

  return (
    <div className="search-page-wrapper">
      <h2 className="search-page-title">KẾT QUẢ TÌM KIẾM</h2>
      {filtered.length > 0 ? (
        <div className="search-page-grid">
          {filtered.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      ) : (
        <p>
          Không tìm thấy sản phẩm phù hợp với từ khóa{" "}
          <strong>"{keyword}"</strong>
        </p>
      )}
    </div>
  );
};

export default SearchResults;
