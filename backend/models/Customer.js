const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define("Customer", {
    customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    avatar_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("active", "inactive", "banned"),
        allowNull: false,
        defaultValue: "active"
    },
    password: {
        type: DataTypes.STRING(255), // Đúng với kiểu dữ liệu trong MySQL
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "customers", // Đặt tên bảng đúng với MySQL
    timestamps: false // Tắt timestamps mặc định của Sequelize vì bạn đã có cột `created_at` và `updated_at`
});

module.exports = Customer;
