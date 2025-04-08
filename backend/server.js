const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const Customer = require('./models/Customer');

const app = express(); // ✅ dòng này là quan trọng nhất

app.use(express.json()); // Cho phép đọc JSON từ req.body

connectDB(); // Kết nối MongoDB

// Route thử
app.get('/api/test-create', async (req, res) => {
  try {
    const newCustomer = new Customer({
      name: 'Sơn 99',
      email: 'son@example.com'
    });

    await newCustomer.save();
    res.send('✅ Tạo khách hàng thành công!');
  } catch (err) {
    res.status(500).send('❌ Lỗi tạo khách hàng');
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));
