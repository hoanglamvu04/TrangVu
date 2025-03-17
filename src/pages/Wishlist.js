import React, { useState } from "react";
import "../styles/Wishlist.css";

const initialWishlistItems = [
  {
    id: 1,
    name: "Áo Thun Trắng",
    price: 250000,
    image: "assets/images/featured-products/polo.png",
  },
  {
    id: 2,
    name: "Áo Khoác Nỉ",
    price: 450000,
    image: "assets/images/featured-products/polo.png",
  },
  {
    id: 3,
    name: "Áo Khoác Nỉ",
    price: 450000,
    image: "assets/images/featured-products/polo.png",
  },
  {
    id: 4,
    name: "Áo Khoác Nỉ",
    price: 450000,
    image: "assets/images/featured-products/polo.png",
  },
  {
    id: 5,
    name: "Áo Khoác Nỉ",
    price: 450000,
    image: "assets/images/featured-products/polo.png",
  },
  {
    id: 2,
    name: "Áo Khoác Nỉ",
    price: 450000,
    image: "assets/images/featured-products/polo.png",
  },
  {
    id: 2,
    name: "Áo Khoác Nỉ",
    price: 450000,
    image: "assets/images/featured-products/polo.png",
  }, {
    id: 2,
    name: "Áo Khoác Nỉ",
    price: 450000,
    image: "assets/images/featured-products/polo.png",
  },
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const handleRemoveItem = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  return (
    <div className="wishlist-container">
      <h2>Sản Phẩm Yêu Thích</h2>
      {wishlistItems.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <img src={item.image} alt={item.name} className="wishlist-image" />
              <div className="wishlist-info">
                <h3>{item.name}</h3>
                <p>{item.price.toLocaleString()} đ</p>
                <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">Bạn chưa lưu sản phẩm nào.</p>
      )}
    </div>
  );
};

export default Wishlist;
