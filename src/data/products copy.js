const products = [
   {id: 1,
    name: "Áo Thun Nam Cotton 220GSM OMGGGGGGG",
    image: "/assets/images/featured-products/polo.png",
    rating: "4.8",
    reviews: "189",
    colors: [
      { code: "#E3DCC9", name: "Be" },
      { code: "#C1C2C2", name: "Xám" },
      { code: "#1E3A8A", name: "Xanh đậm" },
      { code: "#566E5A", name: "Xanh rêu" }
    ],
    currentPrice: "161.000",
    oldPrice: "179.000",
    discount: "10",
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 10, M: 0, L: 5, XL: 0 },
    colorImages: {
      "#E3DCC9": "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2024/AT.220.be.1.jpg",
      "#C1C2C2": "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2025/ao-thun-nam-cotton-220gsm-mau-xam-castlerock_(8).jpg",
      "#1E3A8A": "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/February2025/ao-thun-nam-cotton-220gsm-mau-xanh-dam_(1).jpg",
      "#566E5A": "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2024/AT.220.den2.jpg"
    },
    mainDescription: "Dòng sản phẩm áo thun Cotton 220GSM mang đến trải nghiệm thoải mái, bền chắc và dễ phối đồ.",
    heroImage: "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2024/AT.220.be.2.jpg",
    descriptionItems: [
      {
        title: "Form dáng",
        text: "Form áo suông vừa, không quá rộng cũng không quá ôm, phù hợp mọi vóc dáng.",
        image: "https://mcdn.coolmate.me/image/August2023/mceclip3_82.jpg"
      },
      {
        title: "Chất liệu",
        text: "Chất vải cotton 220GSM cao cấp, mềm mại, thấm hút tốt và co giãn nhẹ.",
        image: "https://mcdn.coolmate.me/image/August2023/mceclip3_82.jpg"
      },
      {
        title: "Thiết kế",
        text: "Thiết kế tối giản hiện đại, dễ kết hợp với mọi loại trang phục.",
        image: "https://mcdn.coolmate.me/image/August2023/mceclip3_82.jpg"
      }
    ]

    
  },
  {
    id: 2,
    name: "Váy công chúa trắng",
    image: "https://down-vn.img.susercontent.com/file/sg-11134201-7rdvl-lyt1635i84te0e.webp",
    rating: "4.8",
    reviews: "5",
    colors: [
      { code: "#FFFFFF", name: "Trắng" }
    ],
    currentPrice: "188.000",
    oldPrice: "269.000",
    discount: "30",
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 10, M: 0, L: 5, XL: 0 },
    colorImages: {
      "#FFFFFF": "https://down-vn.img.susercontent.com/file/sg-11134201-7rdvl-lyt1635i84te0e.webp"
    }
  },
  {
    id: 3,
    name: "Áo thun trơn nam nữ DWIN",
    image: "https://down-vn.img.susercontent.com/file/436c9db6309246b065839d49bac886a4.webp",
    rating: "4.9",
    reviews: "8",
    colors: [
      { code: "#000000", name: "Đen" },
      { code: "#E3DCC9", name: "Be" },
      { code: "#2A6F97", name: "Xanh" },
      { code: "#FFFFFF", name: "Trắng" }
    ],
    currentPrice: "249.000",
    oldPrice: null,
    discount: null,
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 10, M: 0, L: 5, XL: 0 },
    colorImages: {
      "#000000": "https://down-vn.img.susercontent.com/file/0bd26572284148f13a507a80fc2d5420.webp",
      "#E3DCC9": "https://down-vn.img.susercontent.com/file/0ecb597da925cd8bbb88e64cda9e8ebe.webp",
      "#2A6F97": "https://down-vn.img.susercontent.com/file/93513a26d5ec983576efc6ff26a709b9.webp",
      "#FFFFFF": "https://down-vn.img.susercontent.com/file/4b5929ea33253bae165b7f144039964e.webp"
    }
  },
  {
    id: 4,
    name: "Váy Body Thun Cotton Gợi Cảm",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltiafmpn7l7154@resize_w900_nl.webp",
    rating: "4.8",
    reviews: "1.257",
    colors: [
      { code: "#000000", name: "Đen" },
      { code: "#C8A2C8", name: "Hoa Nhí Tím" },
      { code: "#FDF6F1", name: "Hoa Nhí Trắng" },
      { code: "#D2042D", name: "Cherry" },
      { code: "#FF0000", name: "Đỏ Trơn" }
    ],
    currentPrice: "219.000",
    oldPrice: "259.000",
    discount: "15",
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 10, M: 0, L: 5, XL: 0 },
    colorImages: {
      "#000000": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltaqk6pa1uvt66@resize_w900_nl.webp",
      "#C8A2C8": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltaqk6pa0gbd07@resize_w900_nl.webp",
      "#FF0000": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lw2gcuobi19718.webp",
      "#D2042D": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzu7d5ze1php23@resize_w900_nl.webp",
      "#FDF6F1": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltaqk6p9z1qx7b@resize_w900_nl.webp",
    }
  },
  {
    id: 5,
    name: "Áo sơ mi nam tay dài Essentials",
    image: "https://down-vn.img.susercontent.com/file/sg-11134201-23010-3eds9jmvivlv8d.webp",
    rating: "4.6",
    reviews: "98",
    colors: [
     
      { code: "#F5F5F5", name: "Trắng" },
      { code: "#E3DCC9", name: "Be" },
      { code: "#C1C2C2", name: "Xám" },
    ],
    currentPrice: "199.000",
    oldPrice: "249.000",
    discount: "20",
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 0, M: 5, L: 3, XL: 2 },
    colorImages: {
      "#000000": "https://down-vn.img.susercontent.com/file/vn-11134207-23010-oi8g08t2ivlvaf@resize_w900_nl.webp",
      "#F5F5F5": "https://down-vn.img.susercontent.com/file/sg-11134201-23010-ae8gfngvivlv5d.webp",
      "#E3DCC9": "https://down-vn.img.susercontent.com/file/sg-11134201-23010-j0cd4ogvivlvd5.webp",
      "#C1C2C2": "https://down-vn.img.susercontent.com/file/sg-11134201-23010-uc3sy3gvivlvbb.webp",

    }
  },
  {
    id: 6,
    name: "Váy Đầm Body",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0x9tmv2k10t8c.webp",
    rating: "4.7",
    reviews: "63",
    colors: [
      { code: "#000000", name: "Đen" },
      { code: "#C1C2C2", name: "Xám" },
      { code: "#F67266", name: "Hồng" },
    ],
    currentPrice: "159.000",
    oldPrice: "199.000",
    discount: "20",
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 2, M: 4, L: 0, XL: 1 },
    colorImages: {
      "#000000": "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0x9tmv2imun9d.webp",
      "#C1C2C2": "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0x9tmv2zh9pad.webp",
      "#F67266": "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0x9tmv3djcf39.webp",
    }
  },
  {
    id: 7,
    name: "Áo PoLo Nam Thanh Lịch",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lultrh9a8m4ydb.webp",
    rating: "4.9",
    reviews: "312",
    colors: [
      { code: "#000000", name: "Đen" },
      { code: "#F5F5F5", name: "Trắng" },
      { code: "#E3DCC9", name: "Be" },
      { code: "#C1C2C2", name: "Xám" },
      { code: "#FFA500", name: "Cam" },
      { code: "#FFFF00", name: "Vàng" },
      { code: "#2693CF", name: "Xanh Dương" },
      { code: "#00FF00", name: "Xanh Lục" },
    ],
    currentPrice: "279.000",
    oldPrice: "329.000",
    discount: "15",
    sizes: ["M", "L", "XL"],
    sizeStock: { M: 6, L: 0, XL: 2 },
    colorImages: {
      "#000000": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14r3q5h4b@resize_w900_nl.webp",
      "#F5F5F5": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14r54px24@resize_w900_nl.webp",
      "#E3DCC9": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14r2b6a7a@resize_w900_nl.webp",
      "#C1C2C2": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14rc5k503@resize_w900_nl.webp",
      "#FFA500": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14r9c0i32@resize_w900_nl.webp",
      "#FFFF00": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14rdk4l02@resize_w900_nl.webp  ",
      "#2693CF": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14r9cf93d@resize_w900_nl.webp",
      "#00FF00": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lulur14raqky96@resize_w900_nl.webp",
    }
  },
  {
    id: 8,
    name: "Váy / Đầm ngủ xẻ tà phối ren nơ",
    image: "https://down-vn.img.susercontent.com/file/55532d49465999ebe8c17c37be0baaa8.webp",
    rating: "4.8",
    reviews: "46",
    colors: [
      { code: "#000000", name: "Đen" },
      { code: "#FF0000", name: "Đỏ Trơn" }
    ],
    currentPrice: "349.000",
    oldPrice: "399.000",
    discount: "13",
    sizes: ["S", "M", "L"],
    sizeStock: { S: 3, M: 1, L: 0 },
    colorImages: {
      "#000000": "https://down-vn.img.susercontent.com/file/daa108135b68474090c12e52d3cab2df.webp",
      "#FF0000": "https://down-vn.img.susercontent.com/file/00a1f42a66ec0e43268465c8c705e741.webp"
    }
  },
  {
    id: 9,
    name: "Áo Thun Nữ Thể Thao CoolFit",
    image: "https://down-vn.img.susercontent.com/file/vn-11134201-23020-dbwphmf1ylnv70.webp",
    rating: "4.5",
    reviews: "25",
    colors: [
      { code: "#FFEB3B", name: "Vàng" },
      { code: "#FF5722", name: "Cam" },
      { code: "#3F51B5", name: "Xanh biển" }
    ],
    currentPrice: "149.000",
    oldPrice: null,
    discount: null,
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 0, M: 0, L: 5, XL: 3 },
    colorImages: {
      "#FFEB3B": "https://dummyimage.com/600x800/ffeb3b/000000&text=Vàng",
      "#FF5722": "https://dummyimage.com/600x800/ff5722/000000&text=Cam",
      "#3F51B5": "https://dummyimage.com/600x800/3f51b5/ffffff&text=Xanh+biển"
    }
  }
  ];
  
  export default products;
  