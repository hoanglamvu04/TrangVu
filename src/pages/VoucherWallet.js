import React, { useState } from "react";
import "../styles/VoucherWallet.css";

const VoucherWallet = () => {
  const [vouchers, setVouchers] = useState([
    { id: 1, code: "DISCOUNT10", discount: "10%", expiry: "30/04/2025" },
    { id: 2, code: "FREESHIP50", discount: "Miễn phí vận chuyển", expiry: "15/05/2025" },
    { id: 3, code: "SALE20", discount: "20%", expiry: "01/06/2025" }
  ]);

  return (
    <div className="voucher-wallet">
      <h2>Ví Voucher</h2>
      <div className="voucher-list">
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <div key={voucher.id} className="voucher-card">
              <div className="voucher-code">
                <strong>Mã: {voucher.code}</strong>
              </div>
              <div className="voucher-info">
                <p>Giảm giá: <span>{voucher.discount}</span></p>
                <p>Hạn sử dụng: <span>{voucher.expiry}</span></p>
              </div>
              <button className="apply-btn">Áp dụng</button>
            </div>
          ))
        ) : (
          <p className="no-voucher">Bạn chưa có voucher nào.</p>
        )}
      </div>
    </div>
  );
};

export default VoucherWallet;
