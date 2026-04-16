import { Router } from 'express';
import { login, me, register } from './controller.js';
import { authenticate } from './middleware.js';

const authRouter = Router();

// POST /auth/login
authRouter.post('/login', login);

// POST /auth/register — crea nuevos admins
authRouter.post('/register', register);

// GET /auth/me — devuelve el usuario autenticado actual
authRouter.get('/me', authenticate, me);

export default authRouter;