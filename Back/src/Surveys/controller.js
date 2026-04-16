import {
  createSurveyService,
  getSurveysService,
  getSurveyByIdService,
  deleteSurveyService,
} from './service.js';

export const createSurvey = async (req, res, next) => {
  try {
    const { respondent_name, suggestion, answers } = req.body;
    const survey = await createSurveyService({ respondent_name, suggestion, answers });

    res.status(201).json({
      ok: true,
      message: 'Encuesta registrada correctamente',
      survey,
    });
  } catch (err) {
    next(err);
  }
};

export const getSurveys = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const result = await getSurveysService({ page, limit });

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getSurveyById = async (req, res, next) => {
  try {
    const survey = await getSurveyByIdService(req.params.id);
    res.json({ ok: true, survey });
  } catch (err) {
    next(err);
  }
};

export const deleteSurvey = async (req, res, next) => {
  try {
    await deleteSurveyService(req.params.id);
    res.json({ ok: true, message: 'Encuesta eliminada' });
  } catch (err) {
    next(err);
  }
};