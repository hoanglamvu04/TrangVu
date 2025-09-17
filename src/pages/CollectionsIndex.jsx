import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const imgSrc = (u) => (u && u.startsWith("http") ? u : u ? `${API_URL}${u}` : "");

function CollectionsIndex() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/collections?status=Active&activeNow=1`)
      .then((r) => setRows(Array.isArray(r.data) ? r.data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Đang tải bộ sưu tập...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
      <h1 style={{ margin: "8px 0 16px" }}>Bộ sưu tập</h1>
      {rows.length === 0 ? (
        <div>Chưa có bộ sưu tập nào.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: 16,
          }}
        >
          {rows.map((c) => {
            const hero = imgSrc(c.heroImage);
            return (
              <div
                key={c._id}
                onClick={() => navigate(`/collection/${c.slug}`)}
                style={{
                  cursor: "pointer",
                  borderRadius: 14,
                  overflow: "hidden",
                  position: "relative",
                  height: 220,
                  background: "#eee",
                }}
                title={c.description || c.name}
              >
                {hero ? (
                  <img
                    src={hero}
                    alt={c.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {c.name}
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    bottom: 10,
                    background: "rgba(0,0,0,.58)",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: 10,
                    fontWeight: 700,
                  }}
                >
                  {c.name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CollectionsIndex;
