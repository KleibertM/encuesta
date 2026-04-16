import { createError } from "../Auth/middleware.js";
import { Question } from "../data/models/index.js";

export const createQuestionService = async ({ title, description }) => {
  return await Question.create({ title, description });
};

export const getQuestionsService = async () => {
  return await Question.findAll({
    where: { is_active: true },
    order: [["id", "ASC"]],
  });
};


export const deactivateQuestionService = async (id) => {
  const question = await Question.findByPk(id);

  if (!question) {
    throw createError(404, "Pregunta no encontrada");
  }

  question.is_active = false;
  await question.save();

  return question;
};