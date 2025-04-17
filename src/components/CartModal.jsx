import React, { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import "../styles/CartModal.css";
import colorMap from "../utils/colorMap";
import { useNavigate } from "react-router-dom";

const CartModal = ({ onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose(); // đóng modal trước
    navigate("/checkout"); // chuyển trang
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close-btn" onClick={onClose}>×</button>
        <h2 className="cart-modal-title">Giỏ hàng</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Giỏ hàng trống.</p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Màu</th>
                  <th>Size</th>
                  <th>SL</th>
                  <th>Giá</th>
                  <th>Xoá</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={item.image || ""}
                        alt={item.name}
                        className="cart-item-image"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{colorMap[item.selectedColor] || item.selectedColor}</td>
                    <td>{item.selectedSize}</td>
                    <td>
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(
                              item.productCode,
                              item.selectedColor,
                              item.selectedSize,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(
                              item.productCode,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{(item.price * item.quantity).toLocaleString()} đ</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeFromCart(
                            item.productCode,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Tổng: {total.toLocaleString()} đ</span>
              </div>
              <div className="cart-actions">
                <button className="clear-btn" onClick={clearCart}>
                  Xoá tất cả
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Thanh toán
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
