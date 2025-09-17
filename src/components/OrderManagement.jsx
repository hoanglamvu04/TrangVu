import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OrderManagement.css";
import getColorNameFromCode from "../utils/getColorNameFromCode";
import ReviewFormModal from "../components/ReviewFormModal";
import ReviewMyModal from "../components/ReviewMyModal";

const API_URL = process.env.REACT_APP_API_URL;
const API_ORDER = `${API_URL}/api/orders`;

const removeVietnameseTones = (str) => {
  return str.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().replace(/\s+/g, "-");
};

const OrderManagement = () => {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const customerId = customer?._id;

  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [expandedOrders, setExpandedOrders] = useState([]);

  // map các item đã review: { orderId: ["code|detailCode", ...] }
  const [reviewMap, setReviewMap] = useState({});

  // modal state
  const [openForm, setOpenForm] = useState(false);
  const [openMy, setOpenMy] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [myReview, setMyReview] = useState(null);

  useEffect(() => {
    if (!customerId) return;
    fetchCustomerOrders();
    fetchMyReviewMap();
  }, [customerId]);

  const fetchCustomerOrders = async () => {
    try {
      const res = await axios.get(`${API_ORDER}/customer/${customerId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const fetchMyReviewMap = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews/my-map/${customerId}`);
      setReviewMap(res.data || {});
    } catch (err) {
      console.error("Lỗi lấy map đánh giá:", err);
    }
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatus(selectedStatus === status ? "Tất cả" : status);
  };

  const toggleOrderDetails = (id) => {
    setExpandedOrders(expandedOrders.includes(id)
      ? expandedOrders.filter(orderId => orderId !== id)
      : [...expandedOrders, id]);
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Xác nhận huỷ đơn hàng này?")) return;
    try {
      await axios.put(`${API_ORDER}/${id}`, { status: "Cancelled" });
      fetchCustomerOrders();
    } catch (err) {
      alert("Hủy đơn hàng thất bại");
    }
  };

  const statusCounts = {
    "Pending": orders.filter(order => order.status === "Pending").length,
    "Processing": orders.filter(order => order.status === "Processing").length,
    "Shipped": orders.filter(order => order.status === "Shipped").length,
    "Delivered": orders.filter(order => order.status === "Delivered").length,
    "Cancelled": orders.filter(order => order.status === "Cancelled").length,
  };

  const statusLabels = {
    "Pending": "Chưa xử lý",
    "Processing": "Đã xác nhận",
    "Shipped": "Đang giao",
    "Delivered": "Hoàn thành",
    "Cancelled": "Bị hủy",
  };

  const filteredOrders = selectedStatus === "Tất cả"
    ? orders
    : orders.filter(order => statusLabels[order.status] === selectedStatus);

  const itemKey = (it) => `${it.productCode}${it.productDetailCode ? "|" + it.productDetailCode : ""}`;
  const isReviewed = (orderId, item) => (reviewMap[String(orderId)] || []).includes(itemKey(item));

  const openReviewModal = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setOpenForm(true);
  };

  const openMyReviewModal = async (order, item) => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews/me/${customerId}`);
      const list = res.data || [];
      const mine = list.find(r => String(r.order) === String(order._id) &&
        r.productCode === item.productCode &&
        (r.productDetailCode ? r.productDetailCode === item.productDetailCode : true));
      setMyReview(mine || null);
      setOpenMy(true);
    } catch (e) {
      console.error(e);
      setMyReview(null);
      setOpenMy(true);
    }
  };

  return (
    <div className="order-management">
      <h2>Quản Lý Đơn Hàng</h2>

      <div className="order-status-summary">
        {Object.keys(statusLabels).map((key) => {
          const label = statusLabels[key];
          const statusClass = `status-box ${selectedStatus === label ? "active" : ""} ${removeVietnameseTones(label)}`;
          return (
            <button key={key} className={statusClass} onClick={() => toggleStatusFilter(label)}>
              {label} <span>({statusCounts[key]})</span>
            </button>
          );
        })}
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
            <React.Fragment key={order._id}>
              <tr>
                <td>{order.orderCode}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.totalAmount.toLocaleString()} đ</td>
                <td>
                  <span className={`status-label ${removeVietnameseTones(statusLabels[order.status])}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => toggleOrderDetails(order._id)}>
                    {expandedOrders.includes(order._id) ? "❌ Đóng" : "👁 Xem"}
                  </button>
                  {(order.status === "Pending" || order.status === "Processing") && (
                    <button className="cancel-btn" onClick={() => handleCancelOrder(order._id)}>❌ Hủy</button>
                  )}
                </td>
              </tr>

              {expandedOrders.includes(order._id) && (
                <tr className="order-detail-row">
                  <td colSpan="5">
                    <div className="order-detail-content">
                      <div className="order-info">
                        <h4>Thông Tin Giao Hàng</h4>
                        <p><strong>Tên người nhận:</strong> {order.address?.recipientName || order.customer?.fullName || "Bạn"}</p>
                        <p><strong>Địa chỉ người nhận:</strong> {order.address?.fullAddress}</p>
                        <p><strong>Thông tin liên hệ:</strong> {order.address?.phoneNumber}</p>
                        <p><strong>Mã đơn hàng:</strong> {order.orderCode}</p>
                      </div>

                      <div className="product-list">
                        <h4>Thông Tin Sản Phẩm</h4>
                        <table className="product-table">
                          <thead>
                            <tr>
                              <th>Tên SP</th>
                              <th>Size</th>
                              <th>Màu</th>
                              <th>SL</th>
                              <th>Đơn giá</th>
                              <th>Thành tiền</th>
                              <th>Đánh giá</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.productName}</td>
                                <td>{item.selectedSize}</td>
                                <td>{getColorNameFromCode(item.selectedColor)}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price.toLocaleString()} đ</td>
                                <td>{(item.price * item.quantity).toLocaleString()} đ</td>
                                <td>
                                  {order.status === "Delivered" ? (
                                    isReviewed(order._id, item) ? (
                                      <button className="view-btn" onClick={() => openMyReviewModal(order, item)}>
                                        Xem đánh giá của bạn
                                      </button>
                                    ) : (
                                      <button className="review-btn" onClick={() => openReviewModal(order, item)}>
                                        Đánh giá sản phẩm
                                      </button>
                                    )
                                  ) : (
                                    <span style={{ color: "#888" }}>—</span>
                                  )}
                                </td>
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

      {/* Modal viết review */}
      <ReviewFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        order={selectedOrder}
        item={selectedItem}
        onSubmitted={() => fetchMyReviewMap()}
      />

      {/* Modal xem review của tôi */}
      <ReviewMyModal
        open={openMy}
        onClose={() => setOpenMy(false)}
        review={myReview}
      />
    </div>
  );
};

export default OrderManagement;
