import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} TV_Fashion. Hoàng Lâm Vũ.
      </p>
    </footer>
  );
};

export default Footer;
