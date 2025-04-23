import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProductDescription.css";

const API_URL = "http://localhost:5000";

const ProductDescription = ({ product }) => {
  const [descriptions, setDescriptions] = useState([]);
  const [expanded, setExpanded] = useState({});

  const labelMap = {
    material: "Chất liệu",
    form: "Form dáng",
    design: "Thiết kế"
  };

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

  const toggleExpand = (typeKey) => {
    setExpanded((prev) => ({ ...prev, [typeKey]: !prev[typeKey] }));
  };

  const getDescByType = (type) => descriptions.find((desc) => desc.type === type);

  const renderOrder = ["material", "form", "design"];

  return (
    <div className="product-description">
      <h2 className="desc-title">MÔ TẢ SẢN PHẨM</h2>
      <div className="description-grid">
        {renderOrder.map((typeKey, idx) => {
          const desc = getDescByType(typeKey);
          const isExpanded = expanded[typeKey];

          return (
            <div className="description-card" key={idx}>
              <p className="desc-content">
                <strong>{labelMap[typeKey]}:</strong> {desc?.title || "Không có dữ liệu"}
              </p>
              <div className={`desc-content-wrapper ${isExpanded ? "expanded" : ""}`}>
                {desc?.content && <p>{desc.content}</p>}
              </div>
              {desc?.content?.length > 200 && (
                <button className="toggle-btn" onClick={() => toggleExpand(typeKey)}>
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
              {desc?.image && (
                <img
                  src={`${API_URL}${desc.image}`}
                  alt={desc.title}
                  className="desc-image"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDescription;
