import { sequelize, SurveyResponse, Answer } from "../data/models/index.js";
import { createError } from "../Auth/middleware.js";

const PREGUNTAS_VALIDAS = [1, 2, 3, 4, 5];

/**
 * Crear encuesta completa con respuestas (TRANSACCIÓN)
 */
export const createSurveyService = async ({
  respondent_name,
  suggestion,
  answers,
}) => {
  // 🔍 Validaciones
  // if (!Array.isArray(answers) || answers.length !== 5) {
  //   throw createError(400, "Se requieren exactamente 5 respuestas");
  // }

  for (const ans of answers) {
    // if (!PREGUNTAS_VALIDAS.includes(ans.question_id)) {
    //   throw createError(400, `question_id inválido: ${ans.question_id}`);
    // }

    if (
      typeof ans.score !== "number" ||
      ans.score < 1 ||
      ans.score > 5
    ) {
      throw createError(
        400,
        `score inválido en pregunta ${ans.question_id} (1-5)`
      );
    }

    if (!ans.question_title) {
      throw createError(
        400,
        `question_title faltante en pregunta ${ans.question_id}`
      );
    }
  }

  // ❌ evitar duplicados
  const ids = answers.map((a) => a.question_id);
  if (new Set(ids).size !== ids.length) {
    throw createError(400, "Hay preguntas duplicadas");
  }

  // 📊 promedio
  const suma = answers.reduce((acc, a) => acc + a.score, 0);
  const average_score = (suma / answers.length).toFixed(2);

  const t = await sequelize.transaction();

  try {
    // 🧾 Crear encuesta
    const survey = await SurveyResponse.create(
      {
        respondent_name: respondent_name || null,
        suggestion: suggestion || null,
        average_score,
      },
      { transaction: t }
    );

    // 🧩 Crear answers
    const answersData = answers.map((a) => ({
      survey_response_id: survey.id,
      question_id: a.question_id,
      question_title: a.question_title,
      score: a.score,
    }));

    await Answer.bulkCreate(answersData, { transaction: t });

    await t.commit();

    return survey;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Listar encuestas con paginación
 */
export const getSurveysService = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await SurveyResponse.findAndCountAll({
    include: [
      {
        model: Answer,
        as: "answers",
        attributes: ["question_id", "question_title", "score"],
      },
    ],
    order: [["submitted_at", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      total_pages: Math.ceil(count / limit),
    },
  };
};

/**
 * Obtener una encuesta por ID
 */
export const getSurveyByIdService = async (id) => {
  const survey = await SurveyResponse.findByPk(id, {
    include: [
      {
        model: Answer,
        as: "answers",
        attributes: ["question_id", "question_title", "score"],
      },
    ],
  });

  if (!survey) {
    throw createError(404, "Encuesta no encontrada");
  }

  return survey;
};

/**
 * Eliminar encuesta
 */
export const deleteSurveyService = async (id) => {
  const deleted = await SurveyResponse.destroy({
    where: { id },
  });

  if (!deleted) {
    throw createError(404, "Encuesta no encontrada");
  }

  return { id };
};