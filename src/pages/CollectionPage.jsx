import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const imgSrc = (u) => (u && u.startsWith("http") ? u : u ? `${API_URL}${u}` : "");

function CollectionPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");
    Promise.all([
      axios.get(`${API_URL}/api/collections/${slug}`),
      axios.get(`${API_URL}/api/collections/${slug}/products`),
    ])
      .then(([c, p]) => {
        if (!mounted) return;
        setCollection(c.data);
        setProducts(Array.isArray(p.data) ? p.data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setErr("Không tải được bộ sưu tập");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    let list = products;
    if (key) {
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(key) ||
          (p.code || "").toLowerCase().includes(key)
      );
    }
    const byNew = (a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    const byPriceAsc = (a, b) =>
      Number(a.finalPrice || a.originalPrice || 0) -
      Number(b.finalPrice || b.originalPrice || 0);
    const byPriceDesc = (a, b) => -byPriceAsc(a, b);
    const byDiscount = (a, b) => Number(b.discount || 0) - Number(a.discount || 0);

    const sorter =
      sort === "price-asc"
        ? byPriceAsc
        : sort === "price-desc"
        ? byPriceDesc
        : sort === "discount"
        ? byDiscount
        : byNew;

    return [...list].sort(sorter);
  }, [products, q, sort]);

  if (loading) return <div style={{ padding: 24 }}>Đang tải...</div>;
  if (err || !collection)
    return <div style={{ padding: 24 }}>{err || "Không tìm thấy bộ sưu tập"}</div>;

  const banner = imgSrc(collection.bannerImage);
  const hero = imgSrc(collection.heroImage);

  return (
    <div className="collection-page" style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 16,
          background: "#f5f5f5",
          position: "relative",
        }}
      >
        {banner ? (
          <img src={banner} alt={collection.name} style={{ width: "100%", display: "block" }} />
        ) : (
          <div style={{ padding: "28px 20px" }}>
            <h1 style={{ margin: 0 }}>{collection.name}</h1>
            {collection.description ? (
              <p style={{ marginTop: 8, opacity: 0.8 }}>{collection.description}</p>
            ) : null}
          </div>
        )}
        {!banner && hero ? (
          <img
            src={hero}
            alt={collection.name}
            style={{ position: "absolute", right: 0, top: 0, height: "100%", opacity: 0.15 }}
          />
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm trong bộ sưu tập..."
          style={{
            flex: 1,
            minWidth: 220,
            height: 38,
            padding: "0 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ height: 38, border: "1px solid #ddd", borderRadius: 8, padding: "0 10px" }}
        >
          <option value="new">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="discount">Giảm giá nhiều</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div>Chưa có sản phẩm phù hợp.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {filtered.map((p) => (
            <ProductCard key={p._id || p.code} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionPage;
