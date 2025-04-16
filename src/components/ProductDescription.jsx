import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProductDescription.css";

const API_URL = "http://localhost:5000";

const ProductDescription = ({ product }) => {
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/product-descriptions/${product.code}`);
        setDescriptions(res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải mô tả sản phẩm:", error);
      }
    };

    if (product?.code) fetchDescriptions();
  }, [product]);

  if (!descriptions || descriptions.length === 0) {
    return (
      <div className="product-description">
        <h2 className="desc-title">MÔ TẢ SẢN PHẨM</h2>
        <p style={{ padding: "20px", textAlign: "center" }}>{product.name}</p>
        <img src="/assets/no-description.png" alt="Mô tả sản phẩm" style={{ margin: "0 auto", maxHeight: 300 }} />
      </div>
    );
  }

  return (
    <div className="product-description">
      <h2 className="desc-title">MÔ TẢ SẢN PHẨM</h2>
      <div className="description-grid">
        {descriptions.map((desc, idx) => (
          <div className="description-card" key={idx}>
            <h3 className="desc-section">{desc.title}</h3>
            <p className="desc-content">{desc.content}</p>
            {desc.image && (
              <img
                src={`${API_URL}${desc.image}`}
                alt={desc.title}
                className="desc-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDescription;
