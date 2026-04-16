// import { sequelize } from "./models/index.js";

import {sequelize} from "./models/index.js";

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // o force: true (borra todo)
    console.log("✅ Base de datos sincronizada");
  } catch (error) {
    console.error("❌ Error al sincronizar:", error);
  }
};

export default syncDB;