import React, { useEffect, useState } from "react";
import "../styles/NotificationModal.css";

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("notifications");
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications([]); // tránh undefined
      }
    } catch (err) {
      console.error("Lỗi khi đọc thông báo:", err);
      setNotifications([]);
    }
  }, []);

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="modal-header">
          <h3>🔔 Thông báo</h3>
          <button onClick={onClose} className="close-button">
            ❌
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="empty">Không có thông báo nào.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((note, idx) => (
              <li key={idx} className="notification-item">
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
