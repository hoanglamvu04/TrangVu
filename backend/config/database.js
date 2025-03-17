const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("Connecting to database:", process.env.DB_NAME);  // Debug

const sequelize = new Sequelize(
    process.env.DB_NAME || "shop_thoi_trang",  // Đảm bảo có giá trị
    process.env.DB_USER || "root",
    process.env.DB_PASS || "",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => console.log("✅ MySQL connected!"))
    .catch(err => console.log("❌ Error: " + err));

module.exports = sequelize;
