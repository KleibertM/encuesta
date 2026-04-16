import bcrypt from "bcryptjs";
import { sequelize, User } from "./models/index.js";

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a DB");

    const email = "admin@encuestas.com";
    const password = "Admin1234!";
    const name = "Administrador";

    // 🔍 Verificar si existe
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log("ℹ️  El admin ya existe, seed omitido");
      return;
    }

    // 🔒 Hash
    const hash = await bcrypt.hash(password, 12);

    // 💾 Crear usuario
    await User.create({
      name,
      email,
      password_hash: hash,
      role: "admin",
    });

    console.log("✅ Admin creado:");
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log("   ⚠️  Cambia la contraseña luego del primer login");

  } catch (err) {
    console.error("❌ Error en seed:", err.message);
  } finally {
    await sequelize.close(); // 👈 cerrar conexión Sequelize
  }
};

seed();