import React from "react";
import "../styles/FeaturedProducts.css";

const featuredProducts = [
  {
    id: 1,
    name: "Quần dài kaki ECC Pants",
    price: "599.000đ",
    oldPrice: "",
    discount: "",
    rating: "4.9",
    reviews: "21",
    colors: ["#000000", "#808080", "#6B705C"],
    image: "/assets/images/featured-products/pants.png",
    tag: "TẶNG 01 ÁO THUN",
  },
  {
    id: 2,
    name: "Áo Sơ Mi Dài Tay Essentials Cotton",
    price: "359.000đ",
    oldPrice: "399.000đ",
    discount: "-10%",
    rating: "4.8",
    reviews: "63",
    colors: ["#000000", "#D3D3D3", "#B0C4DE"],
    image: "/assets/images/featured-products/shirt.png",
    tag: "ĐÁNG MUA",
  },
  {
    id: 3,
    name: "Áo Thun Nam Cotton 220GSM",
    price: "161.000đ",
    oldPrice: "179.000đ",
    discount: "-10%",
    rating: "4.8",
    reviews: "173",
    colors: ["#D2B48C", "#F5F5F5", "#4682B4"],
    image: "/assets/images/featured-products/tshirt.png",
    tag: "ĐÁNG MUA",
  },
  {
    id: 4,
    name: "Áo Polo Nam Pique Cotton",
    price: "254.000đ",
    oldPrice: "299.000đ",
    discount: "-15%",
    rating: "4.8",
    reviews: "243",
    colors: ["#654321", "#000000", "#6B705C"],
    image: "/assets/images/featured-products/polo.png",
    tag: "ĐÁNG MUA",
  },
  {
    id: 5,
    name: "Quần Shorts ECC Ripstop",
    price: "249.000đ",
    oldPrice: "",
    discount: "",
    rating: "4.8",
    reviews: "24",
    colors: ["#F5F5F5", "#2C3E50", "#000000"],
    image: "/assets/images/featured-products/shorts.png",
    tag: "",
  },
];

const FeaturedProducts = () => {
  return (
    <div className="featured-products">
      <div className="featured-header">
        <h2>SẢN PHẨM NỔI BẬT</h2>
        <a href="#" className="view-more">Xem Thêm</a>
      </div>
      <div className="product-list">
        <button className="scroll-btn left">←</button>
        {featuredProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.tag && <span className="product-tag">{product.tag}</span>}
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <p className="product-rating">
                {product.rating}★ <span className="reviews">({product.reviews})</span>
              </p>
              <p className="product-name">{product.name}</p>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <span key={index} className="color-circle" style={{ backgroundColor: color }}></span>
                ))}
              </div>
              <p className="product-price">
                {product.price}{" "}
                {product.discount && <span className="discount">{product.discount}</span>}
                {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
              </p>
            </div>
          </div>
        ))}
        <button className="scroll-btn right">→</button>
      </div>
    </div>
  );
};

export default FeaturedProducts;
