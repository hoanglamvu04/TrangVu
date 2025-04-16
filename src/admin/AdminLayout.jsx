import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./styles/admin.css"; // nếu có file CSS riêng cho admin

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet /> {/* Quan trọng: phần này hiển thị nội dung từng route con */}
      </main>
    </div>
  );
};

export default AdminLayout;
