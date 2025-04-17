import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
const API_URL = "http://localhost:5000";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;

  useEffect(() => {
    if (customerId) fetchCart();
  }, [customerId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart/${customerId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };

  const addToCart = async (item) => {
    try {
      await axios.post(`${API_URL}/api/cart/${customerId}/add`, item);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
    }
  };

  const updateQuantity = async (productCode, color, size, quantity) => {
    try {
      await axios.put(`${API_URL}/api/cart/${customerId}/update`, {
        productCode,
        selectedColor: color,
        selectedSize: size,
        quantity
      });
      fetchCart();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const removeFromCart = async (productCode, color, size) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${customerId}/delete`, {
        data: { productCode, selectedColor: color, selectedSize: size }
      });
      fetchCart();
    } catch (err) {
      console.error("Lỗi xoá mục:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/api/cart/${customerId}/clear`);
      setCartItems([]);
    } catch (err) {
      console.error("Lỗi xoá toàn bộ:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
