import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../styles/ProductCard.css";
import { Link } from "react-router-dom";


const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-rating">
        <span>★ {product.rating}</span> 
        <span>({product.reviews})</span>
      </div>
      <a href="">
      <img src={product.image} alt={product.name} />
        </a>
            <Link to={`/product/${product.id}`}>
          <div className="product-name">{product.name}</div>
        </Link>
      <div className="product-colors">
        {product.colors.map((color, index) => (
          <span
            key={index}
            className="color-option"
            style={{ backgroundColor: color }}
          ></span>
        ))}
      </div>

      <div className="product-prices">
        <span className="current-price">{product.currentPrice}đ</span>
        {product.oldPrice && <span className="old-price">{product.oldPrice}đ</span>}
        {product.discount && <span className="discount-badge">{product.discount}%</span>}
      </div>
      <div className="product-buttons">
    <button className="buy-now-btn">Mua ngay</button>
    <button className="add-to-cart-btn">
        <FontAwesomeIcon icon={faShoppingCart} /> 
    </button>
</div>

    </div>
  );
};

export default ProductCard;
