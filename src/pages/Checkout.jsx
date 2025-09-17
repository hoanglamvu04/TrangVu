import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getColorNameFromCode from "../utils/getColorNameFromCode";
import "../styles/Checkout.css";

const API_ADDRESS = "http://localhost:5000/api/addresses";
const API_ORDER = "http://localhost:5000/api/orders";
const API_CART = "http://localhost:5000/api/cart";

const Checkout = () => {
  const navigate = useNavigate(); // Dùng navigate để chuyển hướng sau khi đặt hàng
  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;

  const [cartItems, setCartItems] = useState([]); // Giỏ hàng của khách hàng
  const [addresses, setAddresses] = useState([]); // Địa chỉ của khách hàng
  const [selectedAddressId, setSelectedAddressId] = useState(""); // Địa chỉ được chọn

  useEffect(() => {
    if (!customerId) return;
    fetchAddresses(); // Lấy địa chỉ của khách hàng
    fetchCartItems(); // Lấy sản phẩm trong giỏ hàng
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API_ADDRESS}/${customerId}`);
      setAddresses(res.data);
      if (res.data.length) setSelectedAddressId(res.data[0]._id); // Mặc định chọn địa chỉ đầu tiên
    } catch (err) {
      console.error("❌ Lỗi khi lấy địa chỉ:", err);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${API_CART}/${customerId}`);
      const items =
        Array.isArray(res.data) && res.data[0]?.items
          ? res.data[0].items
          : res.data;
      setCartItems(items);
    } catch (err) {
      console.error("❌ Lỗi khi lấy giỏ hàng:", err);
    }
  };

const handlePlaceOrder = async () => {
  const addressObj = addresses.find((a) => a._id === selectedAddressId);
  if (!addressObj) return alert("Vui lòng chọn địa chỉ.");

  try {
    const orderItems = cartItems.map((i) => ({
      productCode: i.productCode || i.code,       // phòng trường hợp key khác
      productDetailCode: i.detailCode,
      productName: i.name,
      quantity: i.quantity,
      price: i.price,
      selectedColor: i.selectedColor,
      selectedSize: i.selectedSize,
    }));

    const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

    await axios.post(API_ORDER, {
      customer: customerId,
      items: orderItems,
      totalAmount,
      address: {
        recipientName: addressObj.label,          // <— TÊN NGƯỜI NHẬN
        fullAddress: addressObj.fullAddress,
        phoneNumber: addressObj.phoneNumber,
      },
    });

    await axios.delete(`${API_CART}/clear/${customerId}`);
    await fetchCartItems();

    alert("Đặt hàng thành công!");
    navigate("/order-management");
  } catch (err) {
    console.error("❌ Lỗi khi đặt hàng:", err);
    alert("Đặt hàng thất bại. Vui lòng thử lại.");
  }
};

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
  const formatCurrency = (n) =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="checkout-container">
      <h2>Thanh toán</h2>

      <div className="checkout-section">
        <h3>1. Địa chỉ giao hàng</h3>
        {addresses.length === 0 ? (
          <p>Chưa có địa chỉ.</p>
        ) : (
          <>
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="address-select"
            >
              {addresses.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.fullAddress} - {a.phoneNumber}
                </option>
              ))}
            </select>
            <div className="selected-address">
              <p><strong>Địa chỉ:</strong> {selectedAddress?.fullAddress}</p>
              <p><strong>SĐT:</strong> {selectedAddress?.phoneNumber}</p>
            </div>
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
          Tổng cộng: <strong>{formatCurrency(cartItems.reduce((s, i) => s + i.price * i.quantity, 0))}</strong>
        </div>
      </div>

      <button className="checkout-button" onClick={handlePlaceOrder} disabled={!cartItems.length}>
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default Checkout;
