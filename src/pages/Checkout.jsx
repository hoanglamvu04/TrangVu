import React, { useEffect, useState } from "react";
import axios from "axios";

const colorMap = {
  "#000000": "Đen",
  "#ffffff": "Trắng",
  // ... thêm các mã màu và tên tương ứng khác
};

const Checkout = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (customerId) {
      fetchCart();
      fetchAddresses();
    }
  }, [customerId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${customerId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/addresses/${customerId}`);
      setAddresses(res.data);
      setSelectedAddress(res.data[0]?._id || null); // chọn địa chỉ đầu tiên nếu có
    } catch (err) {
      console.error("Lỗi lấy địa chỉ:", err);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Thanh Toán</h2>

      <h3>1. Địa chỉ giao hàng</h3>
      {addresses.length === 0 ? (
        <p>Chưa có địa chỉ. Vui lòng thêm địa chỉ trong Hồ sơ.</p>
      ) : (
        <div>
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            style={{ padding: "8px", marginBottom: "10px" }}
          >
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.label ? `${addr.label} - ` : ""}{addr.fullAddress}
              </option>
            ))}
          </select>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px 15px",
              marginBottom: "20px",
              borderRadius: "5px"
            }}
          >
            {addresses.find((a) => a._id === selectedAddress)?.label && (
              <strong>{addresses.find((a) => a._id === selectedAddress)?.label}</strong>
            )}
            <p style={{ margin: 0 }}>
              {addresses.find((a) => a._id === selectedAddress)?.fullAddress}
            </p>
          </div>
        </div>
      )}

      <h3>2. Sản phẩm</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>Tên</th>
            <th style={thStyle}>Phân loại</th>
            <th style={thStyle}>Số lượng</th>
            <th style={thStyle}>Giá</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{colorMap[item.selectedColor] || item.selectedColor} / {item.selectedSize}</td>
              <td style={tdStyle}>{item.quantity}</td>
              <td style={tdStyle}>{(item.quantity * item.price).toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>
        Tổng cộng: {total.toLocaleString()} đ
      </div>

      <button style={{
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}>
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #ccc",
  textAlign: "left"
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee"
};

export default Checkout;
