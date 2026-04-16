import { Router } from 'express';
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  deleteSurvey,
} from './controller.js';
import { authenticate, requireAdmin } from '../Auth/middleware.js';

const surveyRouter = Router();

// POST /surveys — público, cualquiera puede enviar una encuesta
surveyRouter.post('/', createSurvey);

// GET /surveys — solo admin
surveyRouter.get('/', authenticate, requireAdmin, getSurveys);

// GET /surveys/:id — solo admin
surveyRouter.get('/:id', authenticate, requireAdmin, getSurveyById);

// DELETE /surveys/:id — solo admin
surveyRouter.delete('/:id', authenticate, requireAdmin, deleteSurvey);

export default surveyRouter;