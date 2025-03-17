const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sequelize = require("./config/database");
const Customer = require("./models/Customer"); // Import model

const app = express();
app.use(express.json());
app.use(cors());

// API Đăng ký
app.post("/register", async (req, res) => {
    try {
        console.log("🔹 Dữ liệu nhận được:", req.body);

        const { name, email, user_name, password, phone } = req.body;

        if (!name || !email || !user_name || !password) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        // Kiểm tra xem email đã tồn tại chưa
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo khách hàng mới
        const newCustomer = await Customer.create({
            name,
            email,
            user_name,
            password: hashedPassword,
            phone,
            avatar_url: null,
            status: "active"
        });

        res.status(201).json({ message: "Đăng ký thành công!", customer: newCustomer });

    } catch (error) {
        console.error("❌ Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi server! Vui lòng thử lại." });
    }
});

// API Lấy danh sách khách hàng
app.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        console.error("❌ Lỗi lấy danh sách khách hàng:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

app.listen(5000, () => {
    console.log("✅ Server đang chạy trên cổng 5000");
});
