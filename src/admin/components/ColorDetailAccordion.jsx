import React, { useState } from "react";

const ColorDetailAccordion = ({ colorDetails, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const { colorName } = colorDetails[0];

  return (
    <div className="accordion-box">
      <div className="accordion-header" onClick={() => setOpen(!open)}>
        <strong>{colorName}</strong> ({colorDetails.length} chi tiết)
      </div>
      {open && (
        <div className="accordion-body">
          {colorDetails.map((d) => (
            <div key={d._id} style={{ marginBottom: "10px" }}>
              <div>
                <b>Size:</b> {d.size} - <b>Số lượng:</b> {d.quantity}
                {d.image && (
                  <img src={`http://localhost:5000${d.image}`} alt="" width="60" style={{ marginLeft: 10 }} />
                )}
              </div>
              <button onClick={() => onEdit(d)}>Sửa</button>
              <button onClick={() => onDelete(d._id)}>Xoá</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorDetailAccordion;
