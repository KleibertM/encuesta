import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { createError } from './middleware.js';
import User from '../data/models/User.js';

export const loginService = async ({ email, password }) => {
  // 🔍 Buscar usuario
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw createError(401, "Credenciales incorrectas");
  }

  // 🔑 Comparar contraseña
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw createError(401, "Credenciales incorrectas");
  }

  // 🎟️ Generar token
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
export const registerService = async ({ name, email, password }) => {

  // 🔍 Verificar si existe
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    throw createError(409, "Ya existe un usuario con ese email");
  }

  // 🔒 Hash de contraseña
  const hash = await bcrypt.hash(password, 12);

  // 💾 Crear usuario
  const user = await User.create({
    name,
    email,
    password_hash: hash,
    role: "admin",
  });

  // 🚫 No devolver password
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
};