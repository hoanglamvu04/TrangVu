const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    timestamps: false
});

sequelize.sync()
    .then(() => console.log("✅ User table created"))
    .catch(err => console.log("❌ Error: " + err));

module.exports = User;
