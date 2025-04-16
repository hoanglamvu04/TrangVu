import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import DescriptionModal from "../components/DescriptionModal";
import ProductDetailModal from "../components/ProductDetailModal"; 

const API_URL = "http://localhost:5000";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    code: "", name: "", originalPrice: "", discount: 0, finalPrice: "",
    category: "", status: "Active", image: null, imagePath: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mô tả
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [showDescForm, setShowDescForm] = useState(false);
  const [editingDescId, setEditingDescId] = useState(null);
  const [newDesc, setNewDesc] = useState({ type: "form", title: "", content: "", image: null });

  // Chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [newDetail, setNewDetail] = useState({
    detailCode: "", colorCode: "", colorName: "", size: "", quantity: "", image: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/api/products`);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/api/categories`);
    setCategories(res.data);
  };

  // --- MÔ TẢ ---
  const fetchDescriptions = async (productCode) => {
    const res = await axios.get(`${API_URL}/api/product-descriptions/${productCode}`);
    setProductDescriptions(res.data);
  };

  const handleNewDescChange = (e) => {
    const { name, value, files } = e.target;
    setNewDesc({ ...newDesc, [name]: name === "image" ? files[0] : value });
  };

  const handleAddOrUpdateDescription = async () => {
    const formData = new FormData();
    formData.append("productCode", selectedProduct.code);
    formData.append("type", newDesc.type);
    formData.append("title", newDesc.title);
    formData.append("content", newDesc.content);
    if (newDesc.image) formData.append("image", newDesc.image);

    if (editingDescId) {
      await axios.put(`${API_URL}/api/product-descriptions/${editingDescId}`, formData);
    } else {
      await axios.post(`${API_URL}/api/product-descriptions`, formData);
    }
    await fetchDescriptions(selectedProduct.code);
    setShowDescForm(false);
    setEditingDescId(null);
    setNewDesc({ type: "form", title: "", content: "", image: null });
  };

  const handleEditDescription = (desc) => {
    setNewDesc({ type: desc.type, title: desc.title, content: desc.content, image: null });
    setEditingDescId(desc._id);
    setShowDescForm(true);
  };

  const handleDeleteDescription = async (id) => {
    await axios.delete(`${API_URL}/api/product-descriptions/${id}`);
    await fetchDescriptions(selectedProduct.code);
  };

  const openDescriptionModal = async (product) => {
    await fetchDescriptions(product.code);
    setSelectedProduct(product);
    setShowDescriptionModal(true);
    setShowDescForm(false);
    setEditingDescId(null);
    setNewDesc({ type: "form", title: "", content: "", image: null });
  };

  // --- CHI TIẾT ---
  const fetchDetails = async (productCode) => {
    const res = await axios.get(`${API_URL}/api/product-details/${productCode}`);
    setProductDetails(res.data);
  };

  const groupDetailsByColor = (details) => {
    const grouped = {};
    details.forEach((d) => {
      const key = d.colorCode || "unknown";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(d);
    });
    return grouped;
  };
  
  const openDetailModal = async (product) => {
    await fetchDetails(product.code);
    setSelectedProduct(product);
    setShowDetailModal(true);
    setShowDetailForm(false);
    setEditingDetailId(null);
    setNewDetail({ detailCode: "", colorCode: "", colorName: "", size: "", quantity: "", image: null });
  };

  const handleNewDetailChange = (e) => {
    const { name, value, files } = e.target;
    setNewDetail({ ...newDetail, [name]: name === "image" ? files[0] : value });
  };

  const handleAddOrUpdateDetail = async () => {
    const formData = new FormData();
    formData.append("productCode", selectedProduct.code);
    formData.append("color", newDetail.colorCode);
    formData.append("colorName", newDetail.colorName);
    formData.append("size", newDetail.size);
    formData.append("quantity", newDetail.quantity);
    if (newDetail.image) formData.append("image", newDetail.image);

    if (editingDetailId) {
      await axios.put(`${API_URL}/api/product-details/${editingDetailId}`, formData);
    } else {
      await axios.post(`${API_URL}/api/product-details`, formData);
    }
    await fetchDetails(selectedProduct.code);
    setShowDetailForm(false);
    setEditingDetailId(null);
    setNewDetail({ detailCode: "", colorCode: "", colorName: "", size: "", quantity: "", image: null });
  };

  // eslint-disable-next-line no-unused-vars
  const [editingDetail, setEditingDetail] = useState(null);


  const handleEditDetail = (detail) => {
    setShowDetailForm(true); // mở form
    setEditingDetailId(detail._id); // gán ID để update
    setNewDetail({
      colorCode: detail.colorCode,
      colorName: detail.colorName,
      size: detail.size,
      quantity: detail.quantity,
      image: null, // không truyền ảnh cũ
    });
  };
  
  

  const handleDeleteDetail = async (id) => {
    await axios.delete(`${API_URL}/api/product-details/${id}`);
    await fetchDetails(selectedProduct.code);
  };

  // --- SẢN PHẨM ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedForm = {
      ...form,
      [name]: name === "image" ? files[0] : value,
    };
    if (name === "originalPrice" || name === "discount") {
      const price = parseFloat(updatedForm.originalPrice || 0);
      const percent = parseFloat(updatedForm.discount || 0);
      updatedForm.finalPrice = (price - (price * percent) / 100).toFixed(2);
    }
    setForm(updatedForm);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in form) {
      if (key === "image" && form.image) formData.append("image", form.image);
      else if (key !== "image") formData.append(key, form[key]);
    }

    if (editingId) {
      await axios.put(`${API_URL}/api/products/${editingId}`, formData);
      alert("Cập nhật thành công");
    } else {
      await axios.post(`${API_URL}/api/products`, formData);
      alert("Thêm sản phẩm thành công");
    }

    setForm({ code: "", name: "", originalPrice: "", discount: 0, finalPrice: "", category: "", status: "Active", image: null, imagePath: "" });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      code: product.code, name: product.name, originalPrice: product.originalPrice,
      discount: product.discount, finalPrice: product.finalPrice,
      category: product.category?._id || product.category,
      status: product.status, image: null, imagePath: product.image || "",
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) return;
    await axios.delete(`${API_URL}/api/products/${id}`);
    fetchProducts();
  };

  // --- GOM NHÓM MÔ TẢ ---
  const groupedDescriptions = { form: [], material: [], design: [] };
  productDescriptions.forEach((desc) => {
    if (groupedDescriptions[desc.type]) {
      groupedDescriptions[desc.type].push(desc);
    }
  });

  return (
    <div className="admin-page">
      <h2 className="admin-title">Quản lý sản phẩm</h2>

      {/* FORM */}
      <div className="admin-form">
        <input name="code" placeholder="Mã sản phẩm" value={form.code} onChange={handleChange} />
        <input name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} />
        <input name="originalPrice" type="number" placeholder="Giá gốc" value={form.originalPrice} onChange={handleChange} />
        <input name="discount" type="number" placeholder="Giảm giá (%)" value={form.discount} onChange={handleChange} />
        <input name="finalPrice" type="number" disabled value={form.finalPrice} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Đang bán</option>
          <option value="Inactive">Ngưng bán</option>
        </select>
        <input name="image" type="file" accept="image/*" onChange={handleChange} />
        <button className="btn-submit" onClick={handleSubmit}>
          {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </button>
      </div>

      {/* DANH SÁCH */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Giá gốc</th>
            <th>Giảm giá</th>
            <th>Giá mới</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.originalPrice}</td>
              <td>{p.discount}%</td>
              <td>{p.finalPrice}</td>
              <td>{p.category?.name || "Chưa có"}</td>
              <td>{p.status === "Active" ? "Đang bán" : "Ngưng bán"}</td>
              <td>{p.image && <img src={`${API_URL}${p.image}`} alt={p.name} width="60" />}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(p)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(p._id)}>Xoá</button>
                <button className="btn-view-description" onClick={() => openDescriptionModal(p)}>Xem mô tả</button>
                <button className="btn-view-description" onClick={() => openDetailModal(p)}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODALS */}
      {showDescriptionModal && selectedProduct && (
        <DescriptionModal
          product={selectedProduct}
          descriptions={productDescriptions}
          groupedDescriptions={groupedDescriptions}
          onClose={() => setShowDescriptionModal(false)}
          showForm={showDescForm}
          setShowForm={setShowDescForm}
          newDesc={newDesc}
          setNewDesc={setNewDesc}
          onChange={handleNewDescChange}
          onSubmit={handleAddOrUpdateDescription}
          editingId={editingDescId}
          onEdit={handleEditDescription}
          onDelete={handleDeleteDescription}
        />
      )}

{showDetailModal && selectedProduct && (
  <ProductDetailModal
  product={selectedProduct}
  groupedDetails={groupDetailsByColor(productDetails)} // phải có groupedDetails!
  onClose={() => setShowDetailModal(false)}
  showForm={showDetailForm}
  setShowForm={setShowDetailForm}
  newDetail={newDetail}
  setNewDetail={setNewDetail}
  editingId={editingDetailId}
  setEditingId={setEditingDetailId}
  onEdit={handleEditDetail}
  onDelete={handleDeleteDetail}
  fetchDetails={fetchDetails}
/>
)}
    </div>
  );
};

export default ProductManager;
