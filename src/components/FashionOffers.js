import React from "react";
import "../styles/FashionOffers.css";
import discountImg from "../assets/icons/discount.png";
import shippingImg from "../assets/icons/shipping.png";
import voucheImg from "../assets/icons/voucher.png";
import comboImg from "../assets/icons/combo.png";
import ImportedDealsImg from "../assets/icons/ImportedDeals.png";
import buy1get1Img from "../assets/icons/buy1get1.png";
import trendingImg from "../assets/icons/trending.png";

const offers = [
  { name: "Hàng Ngoại Giá Tốt", image: ImportedDealsImg, link: "/collections/ImportedDeals" },
  { name: "Giảm Giá Hôm Nay", image: discountImg, link: "/special/discount" },
  { name: "Miễn Phí Vận Chuyển", image: shippingImg, link: "/special/shipping" },
  { name: "Mua 1 Tặng 1", image: buy1get1Img, link: "/special/buy1get1" },
  { name: "Voucher Thành Viên", image: voucheImg, link: "/special/voucher" },
  { name: "Xu Hướng Mới", image: trendingImg, link: "/special/trending" },
  { name: "Combo Tiết Kiệm", image: comboImg, link: "/special/combo" },
];

const FashionOffers = () => {
  return (
    <div className="fashion-offers">
      {offers.map((offer, index) => (
        <a href={offer.link} key={index} className="offer-item">
          <img src={offer.image} alt={offer.name} />
          <p>{offer.name}</p>
        </a>
      ))}
    </div>
  );
};

export default FashionOffers;
