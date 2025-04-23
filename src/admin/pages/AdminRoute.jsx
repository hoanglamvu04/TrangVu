import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("customer"));
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user || !user.customerCode) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/admin/check-by-code/${user.customerCode}`);
        setIsAdmin(res.data.isAdmin);
      } catch (err) {
        console.error("Lỗi kiểm tra quyền admin:", err);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (isAdmin === null) return <div>Đang kiểm tra quyền truy cập...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
