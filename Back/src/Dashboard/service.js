import pool from '../data/pool.js';

/**
 * Resumen general: total de encuestas, promedio general y por pregunta.
 */
export const getSummaryService = async () => {
  const [generalResult, byQuestionResult, recentResult] = await Promise.all([

    // 🔥 GENERAL
    sequelize.query(`
      SELECT
        COUNT(*)::int AS total_encuestas,
        COALESCE(AVG(average_score), 0)::decimal(4,2) AS promedio_general
      FROM survey_responses
    `, { type: QueryTypes.SELECT }),

    // 🔥 POR PREGUNTA
    sequelize.query(`
      SELECT
        question_id,
        question_title,
        COUNT(*)::int AS total_respuestas,
        ROUND(AVG(score), 2)::decimal(4,2) AS promedio,
        MIN(score) AS min_score,
        MAX(score) AS max_score
      FROM answers
      GROUP BY question_id, question_title
      ORDER BY question_id
    `, { type: QueryTypes.SELECT }),

    // 🔥 RECIENTES
    sequelize.query(`
      SELECT id, respondent_name, average_score, submitted_at
      FROM survey_responses
      ORDER BY submitted_at DESC
      LIMIT 7
    `, { type: QueryTypes.SELECT }),
  ]);

  return {
    total_encuestas: generalResult[0].total_encuestas,
    promedio_general: parseFloat(generalResult[0].promedio_general),
    por_pregunta: byQuestionResult,
    recientes: recentResult,
  };
};

/**
 * Encuestas agrupadas por fecha (para gráfico de línea en el dashboard).
 * Parámetro: 'day', 'week', 'month'
 */
export const getTrendService = async (groupBy = "day") => {
  const truncMap = {
    day: "day",
    week: "week",
    month: "month",
  };

  const trunc = truncMap[groupBy] || "day";

  const result = await sequelize.query(`
    SELECT
      DATE_TRUNC('${trunc}', submitted_at)::date AS fecha,
      COUNT(*)::int AS total,
      ROUND(AVG(average_score), 2) AS promedio
    FROM survey_responses
    GROUP BY DATE_TRUNC('${trunc}', submitted_at)
    ORDER BY fecha DESC
    LIMIT 30
  `, { type: QueryTypes.SELECT });

  return result;
};

/**
 * Distribución de scores para un histograma.
 * Cuántas veces apareció cada puntaje (1-5) por pregunta.
 */
export const getScoreDistributionService = async () => {
  const result = await sequelize.query(`
    SELECT
      question_id,
      question_title,
      score,
      COUNT(*)::int AS frecuencia
    FROM answers
    GROUP BY question_id, question_title, score
    ORDER BY question_id, score
  `, { type: QueryTypes.SELECT });

  const grouped = {};

  for (const row of result) {
    if (!grouped[row.question_id]) {
      grouped[row.question_id] = {
        question_id: row.question_id,
        question_title: row.question_title,
        distribucion: {},
      };
    }

    grouped[row.question_id].distribucion[row.score] = row.frecuencia;
  }

  return Object.values(grouped);
};