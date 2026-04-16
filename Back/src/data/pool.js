import { Sequelize } from "sequelize";

const sequelize = new Sequelize("encuesta", "postgres", "123456789", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // quita logs SQL (puedes poner true si quieres ver queries)
});

export default sequelize;