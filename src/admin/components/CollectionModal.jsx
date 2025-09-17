import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Modal.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const toSlug = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

const emptyForm = {
  collectionCode: "",
  name: "",
  slug: "",
  description: "",
  status: "Active",
  type: "manual",
  priority: 0,
  heroImage: "",
  bannerImage: "",
  startAt: "",
  endAt: "",
  productCodes: "",
  rules: { tags: "", categoryCodes: "", priceMin: "", priceMax: "", discountMin: "" },
  showInNav: false,
  isFeatured: false,
};

const CollectionModal = ({ initialData, onClose, onSuccess }) => {
  const [form, setForm] = useState(emptyForm);
  const [heroFile, setHeroFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        collectionCode: initialData.collectionCode || "",
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        status: initialData.status || "Active",
        type: initialData.type || "manual",
        priority: initialData.priority ?? 0,
        heroImage: initialData.heroImage || "",
        bannerImage: initialData.bannerImage || "",
        startAt: initialData.startAt ? initialData.startAt.slice(0, 16) : "",
        endAt: initialData.endAt ? initialData.endAt.slice(0, 16) : "",
        productCodes: Array.isArray(initialData.productCodes) ? initialData.productCodes.join(",") : (initialData.productCodes || ""),
        rules: {
          tags: Array.isArray(initialData.rules?.tags) ? initialData.rules.tags.join(",") : (initialData.rules?.tags || ""),
          categoryCodes: Array.isArray(initialData.rules?.categoryCodes) ? initialData.rules.categoryCodes.join(",") : (initialData.rules?.categoryCodes || ""),
          priceMin: initialData.rules?.priceMin ?? "",
          priceMax: initialData.rules?.priceMax ?? "",
          discountMin: initialData.rules?.discountMin ?? "",
        },
        showInNav: !!initialData.showInNav,
        isFeatured: !!initialData.isFeatured,
      });
    } else {
      setForm(emptyForm);
    }
    setHeroFile(null);
    setBannerFile(null);
  }, [initialData]);

  const ch = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (name === "name" && !form.slug) setForm((p) => ({ ...p, slug: toSlug(value) }));
  };
  const chRules = (e) => setForm((p) => ({ ...p, rules: { ...p.rules, [e.target.name]: e.target.value } }));

  const submit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      priority: Number(form.priority) || 0,
      productCodes: (form.productCodes || "").split(",").map((x) => x.trim()).filter(Boolean),
      rules: {
        tags: (form.rules.tags || "").split(",").map((x) => x.trim()).filter(Boolean),
        categoryCodes: (form.rules.categoryCodes || "").split(",").map((x) => x.trim()).filter(Boolean),
        priceMin: form.rules.priceMin === "" ? undefined : Number(form.rules.priceMin),
        priceMax: form.rules.priceMax === "" ? undefined : Number(form.rules.priceMax),
        discountMin: form.rules.discountMin === "" ? undefined : Number(form.rules.discountMin),
      },
      slug: form.slug?.trim() || toSlug(form.name),
    };

    const hasFile = heroFile || bannerFile;
    if (hasFile) {
      const fd = new FormData();
      fd.append("data", JSON.stringify(data));
      fd.append("slug", data.slug);
      fd.append("collectionCode", data.collectionCode || "");
      if (heroFile) fd.append("heroImage", heroFile);
      if (bannerFile) fd.append("bannerImage", bannerFile);
      if (initialData?._id) await axios.put(`${API_URL}/api/collections/${initialData._id}`, fd);
      else await axios.post(`${API_URL}/api/collections`, fd);
    } else {
      const payload = data;
      if (initialData?._id) await axios.put(`${API_URL}/api/collections/${initialData._id}`, payload);
      else await axios.post(`${API_URL}/api/collections`, payload);
    }
    onSuccess && onSuccess();
    onClose && onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content compact">
        <h3>{initialData ? "Sửa bộ sưu tập" : "Thêm bộ sưu tập"}</h3>
        <div className="modal-body">
          <form className="form-container compact" onSubmit={submit}>
            <input name="collectionCode" placeholder="Mã bộ sưu tập" value={form.collectionCode} onChange={ch} />
            <input name="name" placeholder="Tên bộ sưu tập" value={form.name} onChange={ch} required />
            <input name="slug" placeholder="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: toSlug(e.target.value) }))} />
            <textarea name="description" placeholder="Mô tả" value={form.description} onChange={ch} />
            <select name="status" value={form.status} onChange={ch}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select name="type" value={form.type} onChange={ch}>
              <option value="manual">manual</option>
              <option value="smart">smart</option>
            </select>
            <input type="number" name="priority" placeholder="Ưu tiên" value={form.priority} onChange={ch} />

            <label className="mini-label">Hero Image (URL hoặc upload)</label>
            <input name="heroImage" placeholder="https://..." value={form.heroImage} onChange={ch} />
            <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files?.[0] || null)} />

            <label className="mini-label">Banner Image (URL hoặc upload)</label>
            <input name="bannerImage" placeholder="https://..." value={form.bannerImage} onChange={ch} />
            <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />

            <label className="mini-label">Bắt đầu</label>
            <input type="datetime-local" name="startAt" value={form.startAt} onChange={ch} />
            <label className="mini-label">Kết thúc</label>
            <input type="datetime-local" name="endAt" value={form.endAt} onChange={ch} />

            {form.type === "manual" && (
              <input name="productCodes" placeholder="P001,P002" value={form.productCodes} onChange={ch} />
            )}
            {form.type === "smart" && (
              <>
                <input name="tags" placeholder="tag1,tag2" value={form.rules.tags} onChange={chRules} />
                <input name="categoryCodes" placeholder="CAT01,CAT02" value={form.rules.categoryCodes} onChange={chRules} />
                <input type="number" name="priceMin" placeholder="Giá tối thiểu" value={form.rules.priceMin} onChange={chRules} />
                <input type="number" name="priceMax" placeholder="Giá tối đa" value={form.rules.priceMax} onChange={chRules} />
                <input type="number" name="discountMin" placeholder="Giảm tối thiểu (%)" value={form.rules.discountMin} onChange={chRules} />
              </>
            )}

            <label className="mini-label">Hiển thị</label>
            <div style={{ display: "flex", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" name="showInNav" checked={form.showInNav} onChange={ch} /> Menu
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={ch} /> Trang chủ
              </label>
            </div>

            <div className="btn-group">
              <button type="submit" className="add-btn">{initialData ? "Cập nhật" : "Thêm"}</button>
              <button type="button" className="cancel-btn" onClick={onClose}>Huỷ</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;
