import React from "react";
import "../styles/ProductDescription.css"; 

const ProductDescription = ({ product }) => {
  return (
    <div className="product-description-section">
      <h2 className="description-title">MÔ TẢ SẢN PHẨM</h2>

      <div className="description-hero">
        <div className="hero-text">
          <h3>{product.name}</h3>
          <p>{product.mainDescription}</p>
        </div>
        <div className="hero-image">
          <img src={product.heroImage} alt="Mô tả sản phẩm" />
        </div>
      </div>

      <div className="description-features">
        {product.descriptionItems?.map((item, idx) => (
          <div key={idx} className="feature-box">
            <img src={item.image} alt={item.title} />
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDescription;
