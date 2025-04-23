import React, { useEffect } from "react";
import { useCart } from "../contexts/CartContext"; 
import "../styles/CartModal.css";
import colorMap from "../utils/colorMap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";

const CartModal = ({ onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    setCartItems,
  } = useCart();

  const navigate = useNavigate();

  const fetchStockForItems = async () => {
    try {
      const updatedItems = await Promise.all(
        cartItems.map(async (item) => {
          const res = await axios.get(`${API_URL}/api/product-details/${item.productCode}`);
          const detail = res.data.find(
            (d) => d.colorCode === item.selectedColor && d.size === item.selectedSize
          );
          return { ...item, stock: detail?.quantity || 0 };
        })
      );
      setCartItems(updatedItems);
    } catch (err) {
      console.error("Lỗi lấy tồn kho:", err);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) fetchStockForItems();
  }, [cartItems.length]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    onClose();
    navigate("/checkout");
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
                {cartItems.map((item) => (
                  <tr key={`${item.productCode}-${item.selectedColor}-${item.selectedSize}`}>
                    <td>
                      <img
                        src={item.image || "/assets/images/placeholder.png"}
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
                          onClick={() => {
                            if (!item.stock || item.quantity >= item.stock) {
                              alert("Số lượng vượt quá tồn kho");
                              return;
                            }
                            updateQuantity(
                              item.productCode,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity + 1
                            );
                          }}
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
