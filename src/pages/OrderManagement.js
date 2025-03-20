import React, { useState } from "react";
import "../styles/OrderManagement.css";
import { FaEye, FaTimesCircle, FaTruck } from "react-icons/fa";

const initialOrders = [
  {
    id: "ORD12345",
    date: "20/03/2025",
    status: "Đang vận chuyển",
    total: "450.000đ",
    items: [
      { name: "Áo thun nam Cotton", price: "220.000đ", quantity: 1 },
      { name: "Quần short thể thao", price: "230.000đ", quantity: 1 },
    ],
  },
  {
    id: "ORD67890",
    date: "18/03/2025",
    status: "Đã giao",
    total: "800.000đ",
    items: [
      { name: "Áo sơ mi nam", price: "400.000đ", quantity: 1 },
      { name: "Quần jean nam", price: "400.000đ", quantity: 1 },
    ],
  },
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCancelOrder = (orderId) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: "Đã hủy" } : order
    ));
  };

  return (
    <div className="order-management">
      <h2 className="order-title">Quản Lý Đơn Hàng</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Mã Đơn</th>
            <th>Ngày Đặt</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td className="actions">
                <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                  <FaEye /> Xem
                </button>
                {order.status === "Đang vận chuyển" && (
                  <button className="cancel-btn" onClick={() => handleCancelOrder(order.id)}>
                    <FaTimesCircle /> Hủy
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="order-details">
          <h3>Chi Tiết Đơn Hàng - {selectedOrder.id}</h3>
          <p><strong>Ngày đặt:</strong> {selectedOrder.date}</p>
          <p><strong>Tổng tiền:</strong> {selectedOrder.total}</p>
          <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
          <h4>Sản phẩm:</h4>
          <ul>
            {selectedOrder.items.map((item, index) => (
              <li key={index}>{item.name} - {item.price} x {item.quantity}</li>
            ))}
          </ul>
          <button className="close-btn" onClick={() => setSelectedOrder(null)}>Đóng</button>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
