import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './src/Auth/routes.js';
import surveyRouter from './src/Surveys/routes.js';
import dashboardRouter from './src/Dashboard/routes.js';
import { errorHandler } from './src/Auth/middleware.js';
import syncDB from './src/data/zync.js';
import questionRouter from './src/Question/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ── Health check ────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Servidor activo', env: process.env.NODE_ENV });
});

// ── Rutas ───────────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/surveys', surveyRouter);
app.use('/dashboard', dashboardRouter);
app.use("/api/questions", questionRouter);

// ── Ruta no encontrada ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Ruta ${req.path} no encontrada` });
});

// ── Manejo global de errores ────────────────────────────────────
app.use(errorHandler);

// ── Iniciar servidor ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   CORS:     ${process.env.FRONTEND_URL || '*'}\n`);
  syncDB();
  
});

export default app;