require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công");
    require("./server"); 
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));
