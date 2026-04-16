import { DataTypes } from "sequelize";
import sequelize from "../pool.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "admin",
  },
}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default User;