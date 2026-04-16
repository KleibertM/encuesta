import { Router } from 'express';

import { authenticate, requireAdmin } from '../Auth/middleware.js';
import { getScoreDistribution, getSummary, getTrend } from './controllers.js';

const dashboardRouter = Router();

// Todos los endpoints del dashboard requieren ser admin
dashboardRouter.use(authenticate, requireAdmin);

// GET /dashboard/summary — resumen general + por pregunta + recientes
dashboardRouter.get('/summary', getSummary);

// GET /dashboard/trend?group_by=day|week|month — evolución en el tiempo
dashboardRouter.get('/trend', getTrend);

// GET /dashboard/distribution — histograma de scores por pregunta
dashboardRouter.get('/distribution', getScoreDistribution);

export default dashboardRouter;