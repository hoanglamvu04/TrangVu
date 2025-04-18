// ... các phần import giữ nguyên
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import DescriptionModal from "../components/DescriptionModal";
import ProductDetailModal from "../components/ProductDetailModal";
import ProductFormModal from "../components/ProductFormModal";
import "../styles/ProductFormModal.css";

const API_URL = "http://localhost:5000";
const ITEMS_PER_PAGE = 30;

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const [form, setForm] = useState({
    code: "", name: "", originalPrice: "", discount: 0, finalPrice: "",
    category: "", status: "Active", image: null, imagePath: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [showDescForm, setShowDescForm] = useState(false);
  const [editingDescId, setEditingDescId] = useState(null);
  const [newDesc, setNewDesc] = useState({ type: "form", title: "", content: "", image: null });

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [newDetail, setNewDetail] = useState({
    detailCode: "", colorCode: "", colorName: "", size: "", quantity: "", image: null,
  });

  const [showStickyHeader, setShowStickyHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowStickyHeader(currentScroll < lastScrollTop || currentScroll < 10);
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/api/products`);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/api/categories`);
    setCategories(res.data);
  };

  const fetchDescriptions = async (productCode) => {
    const res = await axios.get(`${API_URL}/api/product-descriptions/${productCode}`);
    setProductDescriptions(res.data);
  };

  const fetchDetails = async (productCode) => {
    const res = await axios.get(`${API_URL}/api/product-details/${productCode}`);
    setProductDetails(res.data);
  };

  const groupDetailsByColor = (details) => {
    const grouped = {};
    details.forEach((d) => {
      const key = d.colorCode || "unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(d);
    });
    return grouped;
  };

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
    setShowProductForm(false);
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
    setShowProductForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) return;
    await axios.delete(`${API_URL}/api/products/${id}`);
    fetchProducts();
  };

  const openDescriptionModal = async (product) => {
    await fetchDescriptions(product.code);
    setSelectedProduct(product);
    setShowDescriptionModal(true);
    setShowDescForm(false);
    setEditingDescId(null);
    setNewDesc({ type: "form", title: "", content: "", image: null });
  };

  const openDetailModal = async (product) => {
    await fetchDetails(product.code);
    setSelectedProduct(product);
    setShowDetailModal(true);
    setShowDetailForm(false);
    setEditingDetailId(null);
    setNewDetail({ detailCode: "", colorCode: "", colorName: "", size: "", quantity: "", image: null });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const groupedDescriptions = { form: [], material: [], design: [] };
    productDescriptions.forEach((desc) => {
      if (groupedDescriptions[desc.type]) {
        groupedDescriptions[desc.type].push(desc);
      }
    });

  return (
    <div className="admin-page">
      <div className={`section-header ${showStickyHeader ? "visible" : "hidden"}`}>
        <h2 className="admin-title">Quản lý sản phẩm</h2>
        <div className="admin-header-controls">
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên sản phẩm..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-box"
          />
          <button className="add-btn" onClick={() => setShowProductForm(true)}>+ Thêm Sản Phẩm</button>
        </div>
      </div>

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
          {paginatedProducts.map((p) => (
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

      {/* PHÂN TRANG */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* MODALS giữ nguyên */}
      {showProductForm && (
        <ProductFormModal
          form={form}
          categories={categories}
          editingId={editingId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setShowProductForm(false)}
        />
      )}
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
    onChange={(e) =>
      setNewDesc({
        ...newDesc,
        [e.target.name]: e.target.name === "image" ? e.target.files[0] : e.target.value,
      })
    }
    onSubmit={async () => {
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
    }}
    editingId={editingDescId}
    onEdit={(desc) => {
      setNewDesc({
        type: desc.type,
        title: desc.title,
        content: desc.content,
        image: null,
      });
      setEditingDescId(desc._id);
      setShowDescForm(true);
    }}
    onDelete={async (id) => {
      await axios.delete(`${API_URL}/api/product-descriptions/${id}`);
      await fetchDescriptions(selectedProduct.code);
    }}
  />
)}

{showDetailModal && selectedProduct && (
  <ProductDetailModal
    product={selectedProduct}
    groupedDetails={groupDetailsByColor(productDetails)}
    onClose={() => setShowDetailModal(false)}
    showForm={showDetailForm}
    setShowForm={setShowDetailForm}
    newDetail={newDetail}
    setNewDetail={setNewDetail}
    editingId={editingDetailId}
    setEditingId={setEditingDetailId}
    onEdit={(detail) => {
      setShowDetailForm(true);
      setEditingDetailId(detail._id);
      setNewDetail({
        colorCode: detail.colorCode,
        colorName: detail.colorName,
        size: detail.size,
        quantity: detail.quantity,
        image: null,
      });
    }}
    onDelete={async (id) => {
      await axios.delete(`${API_URL}/api/product-details/${id}`);
      await fetchDetails(selectedProduct.code);
    }}
    fetchDetails={fetchDetails}
  />
)}
    </div>
  );
};

export default ProductManager;
