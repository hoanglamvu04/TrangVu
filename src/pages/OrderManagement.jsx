import React, { useState } from "react";
import "../styles/OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD12345",
      date: "20/03/2025",
      total: "450.000đ",
      status: "Đang giao",
      receiver: "Nguyễn Văn A",
      address: "Số 18-20/322 Nhân Mỹ - Mỹ Đình 1 - Hà Nội",
      phone: "0987654321",
      deliveryDate: "23/03/2025",
      items: [
        { code: "SP001", name: "Áo thun nam", size: "M", color: "Đen", quantity: 1, price: 250000, link: "/product/SP001" },
        { code: "SP002", name: "Quần jeans", size: "L", color: "Xanh", quantity: 1, price: 200000, link: "/product/SP002" }
      ]
    },
    {
      id: "ORD67890",
      date: "18/03/2025",
      total: "800.000đ",
      status: "Hoàn thành",
      receiver: "Trần Bảo Ngọc",
      address: "Km 3 + 350 Đường Phan Trọng Tuệ - Thanh Trì - Hà Nội",
      phone: "0912345678",
      deliveryDate: "20/03/2025",
      items: [
        { code: "SP003", name: "Giày sneaker", size: "42", color: "Trắng",quantity: 1, price: 650000, link: "/product/SP001"  },
        { code: "SP004", name: "Balo thời trang", size: "Free size", color: "Đen", quantity: 1, price: 300000, link: "/product/SP001"}
      ]
    },
    {
      id: "ORD99999",
      date: "17/03/2025",
      total: "500.000đ",
      status: "Chưa xử lý",
      receiver: "Lê Thị Minh",
      address: "Số 12, Đường Nguyễn Trãi - Thanh Xuân - Hà Nội",
      phone: "0909876543",
      deliveryDate: "20/03/2025",
      items: [
        { code: "SP005", name: "Áo hoodie", size: "XL", color: "Ghi",quantity: 1, price: 300000, link: "/product/SP001" },
        { code: "SP006", name: "Mũ len", size: "Free size", color: "Đỏ", quantity: 1, price: 300000, link: "/product/SP001" }
      ]
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [expandedOrders, setExpandedOrders] = useState([]);

  

  const statusCounts = {
    "Chưa xử lý": orders.filter(order => order.status === "Chưa xử lý").length,
    "Đã xác nhận": orders.filter(order => order.status === "Đã xác nhận").length,
    "Đang giao": orders.filter(order => order.status === "Đang giao").length,
    "Hoàn thành": orders.filter(order => order.status === "Hoàn thành").length,
    "Bị hủy": orders.filter(order => order.status === "Bị hủy").length
  };

  const filteredOrders = selectedStatus === "Tất cả"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const toggleStatusFilter = (status) => {
    setSelectedStatus(selectedStatus === status ? "Tất cả" : status);
  };

  const toggleOrderDetails = (id) => {
    setExpandedOrders(expandedOrders.includes(id)
      ? expandedOrders.filter(orderId => orderId !== id)
      : [...expandedOrders, id]
    );
  };

  const handleCancelOrder = (id) => {
    setOrders(orders.map(order =>
      order.id === id && (order.status === "Chưa xử lý" || order.status === "Đã xác nhận")
        ? { ...order, status: "Bị hủy" }
        : order
    ));
  };

  return (
    <div className="order-management">
      <h2>Quản Lý Đơn Hàng</h2>

      <div className="order-status-summary">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button key={status} className={`status-box ${selectedStatus === status ? "active" : ""}`}
            onClick={() => toggleStatusFilter(status)}>
            {status} <span>({count})</span>
          </button>
        ))}
      </div>

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
          {filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              <tr>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.total}</td>
                <td>
                  <span className={`status-label ${order.status.toLowerCase().replace(" ", "-")}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => toggleOrderDetails(order.id)}>
                    {expandedOrders.includes(order.id) ? "❌ Đóng" : "👁 Xem"}
                  </button>
                  {(order.status === "Chưa xử lý" || order.status === "Đã xác nhận") && (
                    <button className="cancel-btn" onClick={() => handleCancelOrder(order.id)}>❌ Hủy</button>
                  )}
                </td>
              </tr>

              {expandedOrders.includes(order.id) && (
                <tr className="order-detail-row">
                  <td colSpan="5">
                    <div className="order-detail-content">
                      <div className="order-info">
                        <h4>Thông Tin Giao Hàng</h4>
                        <p><strong>Người nhận:</strong> {order.receiver}</p>
                        <p><strong>Địa chỉ Nhận Hàng:</strong> {order.address}</p>
                        <p><strong>Số Điện Thoại:</strong> {order.phone}</p>
                        <p><strong>Ngày Nhận Dự Kiến:</strong> {order.deliveryDate}</p>
                      </div>

                      <div className="product-list">
                        <h4>Thông Tin Sản Phẩm</h4>
                        <table className="product-table">
                          <thead>
                            <tr>
                            <th>Mã SP</th>
                              <th>Tên SP</th>
                              <th>Size</th>
                              <th>Màu</th>
                              <th>SL</th>
                              <th>Đơn giá</th>
                              <th>Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.code}</td>
                                <td>
                                  <a 
                                    href={item.link} 
                                  >
                                    {item.name}
                                  </a>
                                </td>
                                <td>{item.size}</td>
                                <td>{item.color}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price.toLocaleString()}đ</td>
                                <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
