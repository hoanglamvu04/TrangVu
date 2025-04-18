import React, { useState, useRef, useEffect } from "react";
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
    { name: "Váy Cưới Hồng", image: "/assets/images/women/vay-cuoi-hong.png", link: "/category/vay-cuoi-hong" },
    { name: "Đầm Công Chúa", image: "/assets/images/women/dam-cong-chua.png", link: "/category/dam-cong-chua" },
    { name: "Váy Công Chúa", image: "/assets/images/women/vay-cong-chua.png", link: "/category/vay-cong-chua" },
    { name: "Váy Hồng", image: "/assets/images/women/vay-hong.png", link: "/category/vay-honghong" },
    { name: "Váy Xẻ Tà", image: "/assets/images/women/vay-xe-ta.png", link: "/category/vay-xe-ta" },
    { name: "Bra & Leggings", image: "/assets/images/women/bra-leggings.png", link: "/category/bra-leggings" },
    { name: "Áo Thể Thao", image: "/assets/images/women/ao-the-thao.png", link: "/category/ao-the-thao" },
    { name: "Quần Thể Thao", image: "/assets/images/women/quan-the-thao.png", link: "/category/quan-the-thao" },
    { name: "Phụ Kiện", image: "/assets/images/women/phu-kien.png", link: "/category/phu-kien" },
    { name: "Váy Tennis", image: "/assets/images/women/vay-tennis.png", link: "/category/vay-tennis" },
  ],
};

const ProductCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("men");
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

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

  const checkScrollability = () => {
    const container = scrollRef.current;
    if (container) {
      setShowArrows(container.scrollWidth > container.clientWidth);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [selectedCategory]);

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
        {showArrows && <button className="scroll-btn left" onClick={scrollLeft}>‹</button>}

        <div className="categories-grid" ref={scrollRef}>
          {categoriesData[selectedCategory].map((cat, index) => (
            <a href={cat.link} key={index} className="category-item">
              <img src={cat.image} alt={cat.name} />
              <p>{cat.name}</p>
            </a>
          ))}
        </div>

        {showArrows && <button className="scroll-btn right" onClick={scrollRight}>›</button>}
      </div>
    </div>
  );
};

export default ProductCategories;
