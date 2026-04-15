import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "enceunta",
  password: "",
  port: 5432,
});
