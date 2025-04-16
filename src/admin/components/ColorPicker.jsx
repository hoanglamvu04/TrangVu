// ColorPicker.jsx
import React, { useState } from "react";
import "../styles/color-picker.css";

const colorGroups = {
  "Đỏ": [
    { code: "#ff4d4d", name: "Đỏ cam" },
    { code: "#cc0000", name: "Đỏ đậm" },
    { code: "#ff6666", name: "Đỏ nhạt" },
    { code: "#e60026", name: "Đỏ thắm" },
    { code: "#d11a2a", name: "Đỏ tươi" },
    { code: "#b22222", name: "Đỏ rượu" },
    { code: "#800000", name: "Đỏ mận" }
  ],
  "Xanh": [
    { code: "#0066cc", name: "Xanh dương" },
    { code: "#33cc33", name: "Xanh lá" },
    { code: "#009999", name: "Xanh ngọc" },       // ✅ đã có
    { code: "#00ffcc", name: "Xanh mint" },
    { code: "#2e8b57", name: "Xanh rêu" },
    { code: "#3cb371", name: "Xanh biển" },
    { code: "#1e90ff", name: "Xanh da trời" },
    { code: "#000080", name: "Xanh navy" }         // ✅ thêm mới
  ],
  "Vàng": [
    { code: "#ffcc00", name: "Vàng nghệ" },
    { code: "#ffff66", name: "Vàng chanh" },
    { code: "#f5e050", name: "Vàng tươi" },
    { code: "#f9d71c", name: "Vàng hoàng yến" },
    { code: "#ffb300", name: "Vàng đậm" }
  ],
  "Hồng / Tím": [
    { code: "#ff99cc", name: "Hồng nhạt" },
    { code: "#ff69b4", name: "Hồng sen" },
    { code: "#ff1493", name: "Hồng đậm" },
    { code: "#cc66cc", name: "Tím đậm" },
    { code: "#800080", name: "Tím Huế" },
    { code: "#9370db", name: "Tím oải hương" },
    { code: "#ba55d3", name: "Tím phong lan" }
  ],
  "Nâu / Be": [
    { code: "#8b4513", name: "Nâu đất" },
    { code: "#a0522d", name: "Nâu đỏ" },
    { code: "#bc8f8f", name: "Nâu hồng" },
    { code: "#deb887", name: "Nâu nhạt" },
    { code: "#d2b48c", name: "Màu be" }           // ✅ thêm "màu be"
  ],
  "Xám / Đen": [
    { code: "#000000", name: "Đen" },
    { code: "#1c1c1c", name: "Đen khói" },
    { code: "#2f4f4f", name: "Xám đậm" },
    { code: "#4b4b4b", name: "Xám tiêu" },         // ✅ thêm "xám tiêu"
    { code: "#C1C2C2", name: "Xám nhạt" }          // ✅ thêm màu xám phổ thông
  ],
  "Trắng / Sữa": [
    { code: "#ffffff", name: "Trắng" },
    { code: "#f0f0f0", name: "Trắng ngà" },
    { code: "#fafafa", name: "Trắng sữa" },
    { code: "#f5f5f5", name: "Trắng khói" },
    { code: "#fefee2", name: "Màu sữa" }           // ✅ thêm "màu sữa"
  ]
};

const ColorPicker = ({ onSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState("Đỏ");
  const [selectedColor, setSelectedColor] = useState(null);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setSelectedColor(null);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    if (typeof onSelect === "function") {
      onSelect(color);
    }
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
          >
            <div
              className="color-sub-circle"
              style={{ backgroundColor: color.code }}
            ></div>
            <span className="color-sub-name">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
