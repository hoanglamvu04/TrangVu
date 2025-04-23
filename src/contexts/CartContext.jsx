import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
const API_URL = "http://localhost:5000";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getCustomerId = () => {
    try {
      const customer = JSON.parse(localStorage.getItem("customer"));
      return customer?._id || null;
    } catch {
      return null;
    }
  };  

  useEffect(() => {
    const customerId = getCustomerId();
    if (customerId) fetchCart(customerId);
  }, []);

  const fetchCart = async (customerId = getCustomerId()) => {
    try {
      const res = await axios.get(`${API_URL}/api/cart/${customerId}`);
      setCartItems((prev) =>
        res.data.map((item) => {
          const found = prev.find(
            (p) =>
              p.productCode === item.productCode &&
              p.selectedColor === item.selectedColor &&
              p.selectedSize === item.selectedSize
          );
          return {
            ...item,
            stock: found?.stock ?? 0,
          };
        })
      );
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };
  

  const addToCart = async (item) => {
    const customerId = getCustomerId();
    try {
      await axios.post(`${API_URL}/api/cart/${customerId}/add`, item);
      fetchCart(customerId);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
    }
  };

  const updateQuantity = async (productCode, color, size, quantity) => {
    const customerId = getCustomerId();
    try {
      await axios.put(`${API_URL}/api/cart/${customerId}/update`, {
        productCode,
        selectedColor: color,
        selectedSize: size,
        quantity
      });
      fetchCart(customerId);
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const removeFromCart = async (productCode, color, size) => {
    const customerId = getCustomerId();
    try {
      await axios.delete(`${API_URL}/api/cart/${customerId}/delete`, {
        data: { productCode, selectedColor: color, selectedSize: size }
      });
      fetchCart(customerId);
    } catch (err) {
      console.error("Lỗi xoá mục:", err);
    }
  };

  const clearCart = async () => {
    const customerId = getCustomerId();
    try {
      if (!customerId) throw new Error("Customer ID không tồn tại");

      await axios.delete(`${API_URL}/api/cart/clear/${customerId}`);
      setCartItems([]); // reset lại state
    } catch (err) {
      console.error("Lỗi xoá toàn bộ giỏ hàng:", err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
