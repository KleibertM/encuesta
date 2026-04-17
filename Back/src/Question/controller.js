import { createError } from "../Auth/middleware.js";
import {
  createQuestionService,
  getQuestionsService,
  deactivateQuestionService,
  activateQuestionService,
} from "./service.js";

export const createQuestion = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      throw createError(400, "Título y descripción son requeridos");
    }

    const question = await createQuestionService({ title, description });

    res.status(201).json({ ok: true, data: question });
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const questions = await getQuestionsService();

    res.json({ ok: true, data: questions });
  } catch (err) {
    next(err);
  }
};

export const deactivateQuestion = async (req, res, next) => {
  try {
    const id = req.params.id || req.query.id;

    const question = await deactivateQuestionService(id);

    res.json({ ok: true, data: question });
  } catch (err) {
    next(err);
  }
};

export const activateQuestion = async (req, res, next) => {
  try {
    const id = req.params.id || req.query.id;

    const question = await activateQuestionService(id);

    res.json({ ok: true, data: question });
  } catch (err) {
    next(err);
  }
};