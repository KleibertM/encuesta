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

  const API2 = "https://encuesta-6b87.onrender.com";
  const API = "http://localhost:3000";

  useEffect(() => {
    fetchQuestions(); // Carga las preguntas para la lista
    cargarHistorial(); // Carga las encuestas para que el resumen funcione
  }, []);
  // 🔄 Cargar preguntas
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API2}/api/questions`);
      setQuestions(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar preguntas");
    }
  };
  const cargarHistorial = async () => {
    const datos = await obtenerEncuestas();
    setListaEncuestas(datos); // Aquí es donde realmente se guarda el array
  };
  const obtenerEncuestas = async () => {
    try {
      const res = await axios.get(`${API2}/surveys`, {
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

  // const calcularResultados = (respuestas) => {
  //   const valores = Object.values(respuestas).filter(
  //     (v) => typeof v === "number"
  //   );

  //   const totalRespuestas = valores.length;
  //   const suma = valores.reduce((acc, val) => acc + val, 0);
  //   const promedio = suma / totalRespuestas;

  //   return {
  //     totalRespuestas,
  //     suma,
  //     promedio: promedio.toFixed(2),
  //   };
  // };
  // useEffect(() => {
  //   fetchQuestions();
  //   if (listaEncuestas.length > 0) {
  //     setResumen(calcularResumen(listaEncuestas));
  //   }
  //   const cargar = async () => {
  //     const data = await obtenerEncuestas();
  //     setListaEncuestas(data);
  //   };

  //   cargar();
  // }, []);

  const manejarResumen = () => {
    if (listaEncuestas.length > 0) {
      const res = calcularResumen(listaEncuestas);
      setResumen(res);
    } else {
      alert("No hay encuestas para calcular resultados.");
    }
  };
  const calcularResumen = (encuestas) => {
    if (!encuestas || encuestas.length === 0) return null;

    const total = encuestas.length;
    const suma = encuestas.reduce(
      (acc, e) => acc + parseFloat(e.average_score || 0),
      0
    );
    const promedio = (suma / total).toFixed(2);

    return {
      totalEncuestas: total,    // Nombre coincide con el JSX
      promedioGeneral: promedio  // Nombre coincide con el JSX
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

      await axios.post(`${API2}/api/questions`, form);

      setForm({ title: "", description: "" });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Error al crear pregunta", err);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Desactivar
  const handleDeactivate = async (id) => {
    if (!confirm("¿Desactivar esta pregunta?")) return;
    try {
      await axios.patch(`${API2}/api/questions/deactivate/${id}`);
      await fetchQuestions(); // Esperamos a que recargue
    } catch (err) {
      alert("Error al desactivar. Verifica los permisos de PATCH en el servidor.");
    }
  };

  const handleActivate = async (id) => {
    if (!confirm("¿Activar esta pregunta?")) return;

    try {
      await axios.patch(`${API2}/api/questions/activate/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Error al Activar");
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
                  {q.is_active ? (
                    <button
                      onClick={() => handleDeactivate(q.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(q.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      Activar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={manejarResumen}
            // onClick={'disabled'}
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
            onClick={cargarHistorial}
            // onClick={'disabled'}
            className="w-full mt-2 bg-green-500 text-white py-2 rounded-xl"

          >
            Ver historial de encuestas
          </button>
          {/* Sección de Historial */}
          {listaEncuestas.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Historial Reciente</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {listaEncuestas.map((encuesta) => (
                  <div key={encuesta.id} className="p-4 border bg-gray-50 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        ID: #{encuesta.id}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                        ⭐ {encuesta.average_score}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-2">
                      Respuestas: {encuesta.answers.map(a => a.score).join(" | ")}
                    </p>

                    {encuesta.suggestion && (
                      <div className="bg-white p-2 rounded border text-sm italic text-gray-600">
                        "{encuesta.suggestion}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}