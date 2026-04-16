import sequelize from "../pool.js";

import User from "./User.js";
import Answer from "./Answer.js";
import SurveyResponse from "./surveyResponse.js";
import Question from "./Question.js";

// Relaciones

SurveyResponse.hasMany(Answer, {
  foreignKey: "survey_response_id",
  as: "answers",
  onDelete: "CASCADE",
});

Answer.belongsTo(SurveyResponse, {
  foreignKey: "survey_response_id",
  as: "survey",
});

// Exportar todo
export {
  sequelize,
  User,
  SurveyResponse,
  Answer,
  Question,
};