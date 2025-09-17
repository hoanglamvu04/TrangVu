// ColorPicker.jsx
import React, { useState } from "react";
import "../styles/color-picker.css";

/** NHÓM MÀU — đầy đủ như colorMap đã gửi */
const colorGroups = {
  "Trung tính": [
    { code: "#000000", name: "Đen" },
    { code: "#1c1c1c", name: "Đen khói" },
    { code: "#2f4f4f", name: "Xám đậm" },
    { code: "#4b4b4b", name: "Xám tiêu" },
    { code: "#36454f", name: "Xám than (Charcoal)" },
    { code: "#708090", name: "Xám slate" },
    { code: "#808080", name: "Xám" },
    { code: "#BEBEBE", name: "Xám heather" },
    { code: "#C1C2C2", name: "Xám nhạt" },
    { code: "#D3D3D3", name: "Xám bạc nhạt" },
    { code: "#B2BEB5", name: "Xám tro (Ash)" },
    { code: "#ffffff", name: "Trắng" },
    { code: "#F8F8F8", name: "Trắng sáng" },
    { code: "#f0f0f0", name: "Trắng ngà" },
    { code: "#FFFFF0", name: "Ivory" },
    { code: "#E3DAC9", name: "Bone" },
    { code: "#fafafa", name: "Trắng sữa" },
    { code: "#f5f5f5", name: "Trắng khói" },
    { code: "#fefee2", name: "Màu sữa" },
  ],

  "Be / Khaki / Nâu": [
    { code: "#F5F5DC", name: "Be" },
    { code: "#FFFDD0", name: "Kem (Cream)" },
    { code: "#C2B280", name: "Cát (Sand)" },
    { code: "#C19A6B", name: "Lạc đà (Camel)" },
    { code: "#D2B48C", name: "Khaki nhạt" },
    { code: "#BDB76B", name: "Khaki đậm" },
    { code: "#DEB887", name: "Nâu nhạt (Burly)" },
    { code: "#BC8F8F", name: "Nâu hồng" },
    { code: "#A0522D", name: "Nâu đỏ" },
    { code: "#8B4513", name: "Nâu đất" },
    { code: "#6F4E37", name: "Cà phê" },
    { code: "#5D4037", name: "Sô-cô-la" },
    { code: "#4B3621", name: "Espresso" },
  ],

  "Đỏ / Hồng": [
    { code: "#FF0000", name: "Đỏ tươi" },
    { code: "#FF2400", name: "Đỏ scarlet" },
    { code: "#DC143C", name: "Đỏ tím (Crimson)" },
    { code: "#E60026", name: "Đỏ thắm" },
    { code: "#D11A2A", name: "Đỏ tươi đậm" },
    { code: "#B22222", name: "Đỏ rượu" },
    { code: "#800020", name: "Đỏ burgundy" },
    { code: "#800000", name: "Đỏ mận" },
    { code: "#FF4D4D", name: "Đỏ cam" },
    { code: "#FF6666", name: "Đỏ nhạt" },

    { code: "#FFC0CB", name: "Hồng phấn" },
    { code: "#FF99CC", name: "Hồng nhạt" },
    { code: "#FF69B4", name: "Hồng sen" },
    { code: "#FF1493", name: "Hồng đậm" },
    { code: "#FF7F50", name: "San hô (Coral)" },
    { code: "#FA8072", name: "Hồng cá hồi (Salmon)" },
    { code: "#FAD2C9", name: "Hồng đào (Peach linen)" },
    { code: "#FFDAB9", name: "Peach Puff" },
  ],

  "Cam / Gạch": [
    { code: "#FFA500", name: "Cam" },
    { code: "#CC5500", name: "Cam cháy (Burnt)" },
    { code: "#E2725B", name: "Đất nung (Terracotta)" },
    { code: "#B7410E", name: "Gỉ sét (Rust)" },
    { code: "#F4A58A", name: "Cam nhạt linen (giống ảnh)" },
  ],

  "Vàng": [
    { code: "#FFD700", name: "Vàng kim (Gold)" },
    { code: "#FFBF00", name: "Hổ phách (Amber)" },
    { code: "#F9D71C", name: "Vàng hoàng yến" },
    { code: "#FFDB58", name: "Vàng mù tạt (Mustard)" },
    { code: "#FFF44F", name: "Vàng chanh sáng" },
    { code: "#F5E050", name: "Vàng tươi" },
    { code: "#FFB300", name: "Vàng đậm" },
  ],

  "Xanh dương / Navy / Teal": [
    { code: "#000080", name: "Xanh navy" },
    { code: "#191970", name: "Xanh midnight" },
    { code: "#0047AB", name: "Xanh cobalt" },
    { code: "#4169E1", name: "Xanh hoàng gia (Royal)" },
    { code: "#1560BD", name: "Xanh denim" },
    { code: "#1E90FF", name: "Xanh da trời" },
    { code: "#87CEEB", name: "Xanh trời nhạt" },
    { code: "#BFEFFF", name: "Xanh baby" },
    { code: "#4682B4", name: "Xanh thép (Steel)" },
    { code: "#0066CC", name: "Xanh dương" },
    { code: "#0099CC", name: "Xanh cyan đậm" },
    { code: "#008080", name: "Xanh teal" },
    { code: "#40E0D0", name: "Ngọc lam (Turquoise)" },
    { code: "#7FFFD4", name: "Aquamarine" },
    { code: "#009999", name: "Xanh ngọc" },
  ],

  "Xanh lá (đủ dải)": [
    { code: "#33CC33", name: "Xanh lá" },
    { code: "#32CD32", name: "Xanh lime" },
    { code: "#2E8B57", name: "Xanh rêu" },
    { code: "#3CB371", name: "Xanh biển-lá (SeaGreen)" },
    { code: "#228B22", name: "Xanh rừng" },
    { code: "#556B2F", name: "Xanh olive đậm (Army)" },
    { code: "#808000", name: "Olive" },
    { code: "#8A9A5B", name: "Rêu khô (Moss)" },
    { code: "#9CAF88", name: "Xanh sage" },
    { code: "#B8D3A2", name: "Xanh lá nhạt linen (giống ảnh)" },
    { code: "#98FF98", name: "Xanh mint nhạt" },
    { code: "#AAF0D1", name: "Xanh mint pastel" },
    { code: "#00FFCC", name: "Xanh mint tươi" },
  ],

  "Tím": [
    { code: "#800080", name: "Tím Huế" },
    { code: "#8E4585", name: "Mận tím (Plum)" },
    { code: "#8A2BE2", name: "Tím violet" },
    { code: "#9370DB", name: "Tím oải hương đậm" },
    { code: "#E6E6FA", name: "Lavender" },
    { code: "#C8A2C8", name: "Tím lilac" },
  ],

  "Xanh xám / Rêu xám": [
    { code: "#6B8E23", name: "Olive green" },
    { code: "#708D81", name: "Xanh xám rêu" },
    { code: "#5F9EA0", name: "Xanh xám biển (Cadet)" },
  ],
};

const ColorPicker = ({ onSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState("Trung tính");
  const [selectedColor, setSelectedColor] = useState(null);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setSelectedColor(null);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    if (typeof onSelect === "function") onSelect(color);
  };

  return (
    <div className="color-picker-container">
      <div className="color-main-tabs">
        {Object.keys(colorGroups).map((group) => (
          <button
            key={group}
            className={`color-tab-btn ${selectedGroup === group ? "active" : ""}`}
            onClick={() => handleGroupClick(group)}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="color-sub-grid">
        {colorGroups[selectedGroup].map((color) => (
          <div
            key={color.code}
            className={`color-sub-box ${selectedColor?.code === color.code ? "selected" : ""}`}
            onClick={() => handleColorClick(color)}
            title={color.name}
          >
            <div className="color-sub-circle" style={{ backgroundColor: color.code }} />
            <span className="color-sub-name">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
