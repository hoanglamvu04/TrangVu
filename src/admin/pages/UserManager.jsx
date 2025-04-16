import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";

const API_URL = "http://localhost:5000";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (err) {
      alert("Không thể lấy danh sách khách hàng");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tài khoản này?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Xoá thất bại");
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <h2 className="admin-title">Quản lý tài khoản khách hàng</h2>

      <div className="admin-top-bar">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-box"
        />
        <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Thêm người dùng</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã KH</th>
            <th>Ảnh</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Ngày sinh</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.customerCode}</td>
              <td>
                <img
                  src={`http://localhost:5000${user.avatar || "/uploads/default-avatar.png"}`}
                  alt="avatar"
                  width="40"
                  height="40"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "-"}</td>
              <td>{user.status}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="admin-btn btn-edit" onClick={() => handleEdit(user)}>Sửa</button>{" "}
                <button className="admin-btn btn-delete" onClick={() => handleDelete(user._id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchUsers();
            setShowAddModal(false);
          }}
        />
      )}

      {/* Modal sửa */}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => {
            fetchUsers();
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManager;
