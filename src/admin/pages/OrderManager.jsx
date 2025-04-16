import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css"; // Đổi sang file dùng chung
import AddOrderModal from "../components/AddOrderModal";
import EditOrderModal from "../components/EditOrderModal";
import OrderDetailModal from "../components/OrderDetailModal";

const API_URL = "http://localhost:5000";

const statusLabels = {
  All: "Tất cả",
  Pending: "Chưa xử lý",
  Processing: "Đã xác nhận",
  Shipped: "Đang giao",
  Delivered: "Hoàn thành",
  Cancelled: "Bị huỷ",
};

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/orders`);
      setOrders(res.data);
    } catch (err) {
      alert("Không thể lấy danh sách đơn hàng");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/admin/orders/${id}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xoá đơn hàng này?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/orders/${id}`);
        fetchOrders();
      } catch (err) {
        alert("Xoá thất bại");
      }
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
  };

  const handleViewDetails = (order) => {
    setViewingOrder(order);
  };

  const handleViewAddress = (order) => {
    alert(`Xem địa chỉ giao hàng của khách: ${order.customer?.fullName}`);
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const statusCounts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Shipped: orders.filter((o) => o.status === "Shipped").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  return (
    <div className="admin-page">
      <h2>Quản lý đơn hàng</h2>

      {/* Bộ lọc trạng thái */}
      <div className="filter-group">
        {Object.keys(statusLabels).map((status) => (
          <button
            key={status}
            className={`order-manager-filter-btn ${statusFilter === status ? "active" : ""} ${status.toLowerCase()}`}
            onClick={() => setStatusFilter(status)}
          >
            {statusLabels[status]} ({statusCounts[status]})
          </button>
        ))}
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Thêm đơn hàng
        </button>
      </div>

      {/* Bảng đơn hàng */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderCode}</td>
              <td>{order.customer?.fullName}</td>
              <td>{order.totalAmount.toLocaleString()}đ</td>
              <td>
                <select
                  className="order-status-dropdown"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Chưa xử lý</option>
                  <option value="Processing">Đã xác nhận</option>
                  <option value="Shipped">Đang giao</option>
                  <option value="Delivered">Hoàn thành</option>
                  <option value="Cancelled">Bị huỷ</option>
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleViewDetails(order)} className="admin-btn btn-confirm">Xem chi tiết</button>
                <button onClick={() => handleViewAddress(order)} className="admin-btn btn-cancel">Địa chỉ</button>
                <button onClick={() => handleEditOrder(order)} className="admin-btn btn-edit">Sửa</button>
                <button onClick={() => handleDelete(order._id)} className="admin-btn btn-delete">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm đơn hàng */}
      {showAddModal && (
        <AddOrderModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchOrders();
            setShowAddModal(false);
          }}
        />
      )}

      {/* Modal sửa đơn hàng */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={() => {
            fetchOrders();
            setEditingOrder(null);
          }}
        />
      )}

      {/* Modal xem chi tiết đơn hàng */}
      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderManager;
