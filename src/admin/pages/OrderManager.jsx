import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import AddOrderModal from "../components/AddOrderModal";
import EditOrderModal from "../components/EditOrderModal";
import OrderDetailModal from "../components/OrderDetailModal";
import AddressModal from "../components/AddressModal";

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
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [addressModal, setAddressModal] = useState(null);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Phân trang
  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      setShowHeader(currentScroll < lastScrollTop || currentScroll < 10);
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

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
    const customerName = order.customer?.fullName || "Không rõ";
    const address = order.address || "Không có địa chỉ";
    setAddressModal({ name: customerName, address });
  };

  const filteredOrders = orders
    .filter((order) =>
      statusFilter === "All" || order.status === statusFilter
    )
    .filter((order) =>
      order.orderCode?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.fullName?.toLowerCase().includes(search.toLowerCase())
    );

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className={`section-header ${showHeader ? "visible" : "hidden"}`}>
        <h2 className="admin-title">Quản lý đơn hàng</h2>
        <div className="admin-header-controls">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-box"
          />
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + Thêm đơn hàng
          </button>
        </div>
      </div>

      <div className="filter-group">
        {Object.keys(statusLabels).map((status) => (
          <button
            key={status}
            className={`order-manager-filter-btn ${statusFilter === status ? "active" : ""} ${status.toLowerCase()}`}
            onClick={() => {
              setStatusFilter(status);
              setCurrentPage(1);
            }}
          >
            {statusLabels[status]} ({statusCounts[status]})
          </button>
        ))}
      </div>

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
          {paginatedOrders.map((order) => (
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

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showAddModal && (
        <AddOrderModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchOrders();
            setShowAddModal(false);
          }}
        />
      )}

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

      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}

      {addressModal && (
        <AddressModal
          customerName={addressModal.name}
          address={addressModal.address}
          onClose={() => setAddressModal(null)}
        />
      )}
    </div>
  );
};

export default OrderManager;
