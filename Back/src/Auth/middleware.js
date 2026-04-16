import jwt from 'jsonwebtoken';

/**
 * Verifica que el request tiene un JWT válido.
 * Adjunta el payload decodificado en req.user.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      message: 'Token de acceso requerido',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'El token ha expirado'
        : 'Token inválido';

    return res.status(401).json({ ok: false, message });
  }
};

/**
 * Verifica que el usuario autenticado tiene rol 'admin'.
 * Debe usarse después de `authenticate`.
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Acceso denegado: se requiere rol admin',
    });
  }
  next();
};

/**
 * Middleware global de manejo de errores.
 * Captura cualquier error pasado con next(err).
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Error de validación personalizado
  if (err.status) {
    return res.status(err.status).json({
      ok: false,
      message: err.message,
    });
  }

  // Error de constraint de PostgreSQL (ej: email duplicado)
  if (err.code === '23505') {
    return res.status(409).json({
      ok: false,
      message: 'Ya existe un registro con esos datos',
    });
  }

  // Error genérico
  res.status(500).json({
    ok: false,
    message: 'Error interno del servidor',
  });
};

/**
 * Pequeña utilidad para lanzar errores HTTP desde los controllers.
 * Uso: throw createError(400, 'Mensaje de error')
 */
export const createError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};