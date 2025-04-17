import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Checkout.css";
import getColorNameFromCode from "../utils/getColorNameFromCode";

const API_ADDRESS = "http://localhost:5000/api/addresses";
const API_ORDER = "http://localhost:5000/api/orders";

const Checkout = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    if (customerId) {
      fetchAddresses();
      fetchCartItems();
    }
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API_ADDRESS}/${customerId}`);
      setAddresses(res.data);
      if (res.data.length > 0) {
        setSelectedAddress(res.data[0].fullAddress);
      }
    } catch (err) {
      console.error("Lỗi khi lấy địa chỉ:", err);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${customerId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        productName: item.name, // đảm bảo tên truyền đúng
        quantity: item.quantity,
        price: item.price,
        color: item.selectedColor,
        size: item.selectedSize,
      }));
      const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

      await axios.post(API_ORDER, {
        customer: customerId,
        items: orderItems,
        totalAmount,
      });

      alert("Đặt hàng thành công!");
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      alert("Đặt hàng thất bại.");
    }
  };

  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="checkout-container">
      <h2>Thanh Toán</h2>

      <div className="checkout-section">
        <h3>1. Địa chỉ giao hàng</h3>
        {addresses.length === 0 ? (
          <p>Chưa có địa chỉ. Vui lòng thêm địa chỉ trong Hồ sơ.</p>
        ) : (
          <>
            <select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="address-select"
            >
              {addresses.map((addr) => (
                <option key={addr._id} value={addr.fullAddress}>
                  {addr.fullAddress}
                </option>
              ))}
            </select>
            <div className="selected-address">{selectedAddress}</div>
          </>
        )}
      </div>

      <div className="checkout-section">
        <h3>2. Sản phẩm</h3>
        <table className="checkout-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Phân loại</th>
              <th>Số lượng</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{getColorNameFromCode(item.selectedColor)} / {item.selectedSize}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="checkout-total">
          Tổng cộng:{" "}
          <strong>
            {formatCurrency(
              cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
            )}
          </strong>
        </div>
      </div>

      <button className="checkout-button" onClick={handlePlaceOrder}>
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default Checkout;
