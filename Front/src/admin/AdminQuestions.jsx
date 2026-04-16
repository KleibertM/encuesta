import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const [listaEncuestas, setListaEncuestas] = useState([]);
  const [resumen, setResumen] = useState(null);


  const API = "http://localhost:3001/api/questions";

  // 🔄 Cargar preguntas
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(API);
      setQuestions(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar preguntas");
    }
  };
  const obtenerEncuestas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/surveys", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.data; // 👈 importante
    } catch (error) {
      console.error("Error obteniendo encuestas", error);
      return [];
    }
  };

  const calcularResultados = (respuestas) => {
    const valores = Object.values(respuestas).filter(
      (v) => typeof v === "number"
    );

    const totalRespuestas = valores.length;
    const suma = valores.reduce((acc, val) => acc + val, 0);
    const promedio = suma / totalRespuestas;

    return {
      totalRespuestas,
      suma,
      promedio: promedio.toFixed(2),
    };
  };
  useEffect(() => {
    fetchQuestions();
    if (listaEncuestas.length > 0) {
      setResumen(calcularResumen(listaEncuestas));
    }
    const cargar = async () => {
      const data = await obtenerEncuestas();
      setListaEncuestas(data);
    };

    cargar();
  }, []);


  const calcularResumen = (encuestas) => {
    if (!encuestas.length) return null;

    const total = encuestas.length;

    const suma = encuestas.reduce(
      (acc, e) => acc + parseFloat(e.average_score),
      0
    );

    const promedio = (suma / total).toFixed(2);

    return {
      total,
      promedio,
    };
  };
  // ✍️ Manejar input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ➕ Crear pregunta
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      await axios.post(API, form);

      setForm({ title: "", description: "" });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Error al crear pregunta");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Desactivar
  const handleDeactivate = async (id) => {
    if (!confirm("¿Desactivar esta pregunta?")) return;

    try {
      await axios.patch(`${API}/${id}/deactivate`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Error al desactivar");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* 🧾 FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow mb-6"
        >
          <h2 className="text-xl font-bold mb-4">
            Crear Nueva Pregunta
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded-lg"
            rows="3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-80"
          >
            {loading ? "Guardando..." : "Crear pregunta"}
          </button>
        </form>

        {/* 📋 LISTA */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Lista de Preguntas
          </h2>

          {questions.length === 0 ? (
            <p className="text-gray-500">No hay preguntas</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="border p-4 rounded-xl flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">{q.title}</h3>
                    <p className="text-sm text-gray-600">
                      {q.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeactivate(q.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Desactivar
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            // onClick={() => setResumen(calcularResumen(listaEncuestas))}
            onClick={'disabled'}
            className="w-full mt-3 bg-red-800 text-white py-2 rounded-xl hover:opacity-80"
          >
            Ver resultados acumulados
          </button>
          {resumen && (
            <div className="mt-4 p-4 rounded-xl bg-black text-white">
              <h3 className="text-center font-bold mb-2">
                📊 Resumen General
              </h3>

              <p className="text-center">
                Total encuestas: {resumen.totalEncuestas}
              </p>

              <p className="text-center text-lg font-semibold">
                Promedio general: ⭐ {resumen.promedioGeneral}
              </p>
            </div>
          )}

          <button
            type="button"
            // onClick={() => setListaEncuestas(obtenerEncuestas())}
            onClick={'disabled'}
            className="w-full mt-2 bg-green-500 text-white py-2 rounded-xl"
            
          >
            Ver historial de encuestas
          </button>
          {listaEncuestas.map((encuesta) => (
            <div key={encuesta.id} className="p-4 border rounded-xl">
              <p>⭐ Promedio: {encuesta.average_score}</p>

              <p>
                📊 Respuestas:
                {encuesta.answers.map(a => a.score).join(" - ")}
              </p>

              {encuesta.suggestion && (
                <p>💬 {encuesta.suggestion}</p>
              )}
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}