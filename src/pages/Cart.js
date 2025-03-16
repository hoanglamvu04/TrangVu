import React, { useState } from "react";
import "../styles/Cart.css";

const initialCartItems = [
  {
    id: 1,
    name: "Rau Dền",
    price: 12000,
    quantity: 1,
    image: "/assets/images/men/ao-khoac.png",
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Giỏ Hàng</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>HÌNH ẢNH</th>
            <th>TÊN SẢN PHẨM</th>
            <th>GIÁ</th>
            <th>SỐ LƯỢNG</th>
            <th>THÀNH TIỀN</th>
            <th>HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr key={item.id}>
                <td><img src={item.image} alt={item.name} className="cart-item-image" /></td>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()} đ</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toLocaleString()} đ</td>
                <td>
                  <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-cart">Giỏ hàng của bạn đang trống.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="cart-summary">
        <h3>Tổng Cộng: <span>{totalPrice.toLocaleString()} đ</span></h3>
        <div className="cart-buttons">
          <button className="continue-btn">Tiếp Tục Mua Sắm</button>
          <button className="clear-btn" onClick={handleClearCart}>Xóa Tất Cả</button>
          <button className="checkout-btn">Thanh Toán</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
