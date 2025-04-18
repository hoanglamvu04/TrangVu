import React, { useEffect, useState } from "react";
import "../styles/NotificationModal.css";
import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const customer = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    if (customer?._id) fetchNotifications();
  }, [customer]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/${customer._id}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Lỗi xoá thông báo:", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(`${API_URL}/all/${customer._id}`);
      setNotifications([]);
    } catch (err) {
      console.error("❌ Lỗi xoá tất cả thông báo:", err);
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "placed":
        return { icon: "🛒", color: "#007bff" };
      case "confirmed":
        return { icon: "✅", color: "#28a745" };
      case "shipping":
        return { icon: "🚚", color: "#fd7e14" };
      case "delivered":
        return { icon: "📦", color: "#20c997" };
      case "cancelled":
        return { icon: "❌", color: "#dc3545" };
      default:
        return { icon: "🔔", color: "#6c757d" };
    }
  };

  return (
    <div className="notification-overlay">
      <div className="notification-modal">
        <div className="notification-header">
          <span>🔔 Thông báo</span>
          <button onClick={onClose}>❌</button>
        </div>

        <div className="notification-content">
          {loading ? (
            <p>Đang tải thông báo...</p>
          ) : notifications.length === 0 ? (
            <p>Không có thông báo nào.</p>
          ) : (
            <>
              <ul className="notification-list">
                {notifications.map((noti) => {
                  const { icon, color } = getNotificationStyle(noti.type);
                  return (
                    <li key={noti._id} className="notification-item">
                    <div style={{ color }}>
                      <strong>
                        {icon} Đơn hàng{" "}
                        <span style={{ textDecoration: "underline" }}>
                          {noti.orderCode || "Không rõ mã"}
                        </span>
                      </strong>
                      : {noti.message}
                    </div>
                    <div className="notification-time">
                      🕓 {new Date(noti.createdAt).toLocaleString("vi-VN")}
                    </div>
                    <button className="notification-delete" onClick={() => handleDelete(noti._id)}>
                      Xoá thông báo
                    </button>
                  </li>
                  
                  );
                })}
              </ul>
              <button className="notification-delete-all" onClick={handleDeleteAll}>
                Xoá tất cả
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
