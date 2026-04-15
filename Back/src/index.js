import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint para guardar respuestas
app.post("/api/respuestas", (req, res) => {
  const { respuestas } = req.body;

  console.log("Datos recibidos:", respuestas);

  async function insertarRespuesta(respuesta) {
    try {
      await pool.query(
        "INSERT INTO respuestas (pregunta_id, valor) VALUES ($1, $2)",
        [respuesta.preguntaId, respuesta.valor]
      );
      console.log("Respuesta insertada:", respuesta);
    } catch (error) {
      console.error("Error al insertar respuesta:", error);
    }
  }

  respuestas.forEach((respuesta) => {
    insertarRespuesta(respuesta);
  });

  res.json({
    ok: true,
    message: "Respuestas guardadas correctamente",
  });
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});