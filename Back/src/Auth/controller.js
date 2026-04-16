
import { createError } from './middleware.js';
import { loginService, registerService } from './service.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, 'Email y contraseña son requeridos');
    }

    const data = await loginService({ email, password });

    res.json({ ok: true, ...data });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createError(400, 'Nombre, email y contraseña son requeridos');
    }

    if (password.length < 8) {
      throw createError(400, 'La contraseña debe tener al menos 8 caracteres');
    }

    const user = await registerService({ name, email, password });

    res.status(201).json({ ok: true, user });
  } catch (err) {
    next(err);
  }
};

export const me = (req, res) => {
  res.json({ ok: true, user: req.user });
};