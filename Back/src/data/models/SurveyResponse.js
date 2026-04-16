import { DataTypes } from "sequelize";
import sequelize from "../pool.js";

const SurveyResponse = sequelize.define("SurveyResponse", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  respondent_name: {
    type: DataTypes.STRING(100),
  },
  average_score: {
    type: DataTypes.DECIMAL(4,2),
    allowNull: false,
  },
  suggestion: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "survey_responses",
  timestamps: true,
  createdAt: "submitted_at",
  updatedAt: false,
});

export default SurveyResponse;