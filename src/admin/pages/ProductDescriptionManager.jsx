import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css"
const ProductDetail = () => {
  const { id } = useParams(); // ví dụ id là productCode
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product-descriptions/${id}`);
        setDescriptions(res.data);
      } catch (err) {
        console.error("Lỗi tải mô tả:", err);
      }
    };
    fetchDescriptions();
  }, [id]);

  return (
    <div className="product-description-section">
      <h2>MÔ TẢ SẢN PHẨM</h2>
      <div className="description-blocks">
        {descriptions.map((desc, index) => (
          <div key={index} className="description-item">
            <div className="description-text">
              <h3>{desc.title}</h3>
              <p>{desc.content}</p>
            </div>
            {desc.image && (
              <div className="description-image">
                <img src={`http://localhost:5000${desc.image}`} alt={desc.title} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
