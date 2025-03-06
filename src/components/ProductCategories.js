import React, { useState, useRef } from "react";
import "../styles/ProductCategories.css"; 

const categoriesData = {
  men: [
    { name: "Áo Thun", image: "/assets/images/men/ao-thun.png", link: "/category/ao-thun" },
    { name: "Sơ Mi", image: "/assets/images/men/so-mi.png", link: "/category/so-mi" },
    { name: "Áo Khoác", image: "/assets/images/men/ao-khoac.png", link: "/category/ao-khoac" },
    { name: "Quần Dài", image: "/assets/images/men/quan-dai.png", link: "/category/quan-dai" },
    { name: "Quần Short", image: "/assets/images/men/quan-short.png", link: "/category/quan-short" },
    { name: "Quần Lót", image: "/assets/images/men/quan-lot.png", link: "/category/quan-lot" },
    { name: "Phụ Kiện", image: "/assets/images/men/phu-kien.png", link: "/category/phu-kien" },
  ],
  women: [
    { name: "Bra & Leggings", image: "/assets/images/women/bra-leggings.png", link: "/category/bra-leggings" },
    { name: "Áo Thể Thao", image: "/assets/images/women/ao-the-thao.png", link: "/category/ao-the-thao" },
    { name: "Quần Thể Thao", image: "/assets/images/women/quan-the-thao.png", link: "/category/quan-the-thao" },
    { name: "Phụ Kiện", image: "/assets/images/women/phu-kien.png", link: "/category/phu-kien" },
  ],
};

const ProductCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("men");
  const scrollRef = useRef(null);


  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -window.innerWidth / 1.2, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: window.innerWidth / 1.2, behavior: "smooth" });
    }
  };

  return (
    <div className="product-categories-container">
      <div className="category-switch">
        <button className={selectedCategory === "men" ? "active" : ""} onClick={() => setSelectedCategory("men")}>
          Đồ Nam
        </button>
        <button className={selectedCategory === "women" ? "active" : ""} onClick={() => setSelectedCategory("women")}>
          Đồ Nữ
        </button>
      </div>

      <div className="carousel-container">
        <button className="scroll-btn left" onClick={scrollLeft}>‹</button>

        <div className="categories-grid" ref={scrollRef}>
          {categoriesData[selectedCategory].map((cat, index) => (
            <a href={cat.link} key={index} className="category-item">
              <img src={cat.image} alt={cat.name} />
              <p>{cat.name}</p>
            </a>
          ))}
        </div>

        <button className="scroll-btn right" onClick={scrollRight}>›</button>
      </div>
    </div>
  );
};

export default ProductCategories;
