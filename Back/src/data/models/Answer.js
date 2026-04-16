import { DataTypes } from "sequelize";
import sequelize from "../pool.js";
const Answer = sequelize.define("Answer", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  question_title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  tableName: "answers",
  timestamps: false,
});

export default Answer;