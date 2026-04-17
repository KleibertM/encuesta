import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function EncuestaForm() {
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [resultado, setResultado] = useState(null);
    const [listaEncuestas, setListaEncuestas] = useState([]);

    useEffect(() => {
        const fetchPreguntas = async () => {
            try {
                const res = await axios.get("https://encuesta-6b87.onrender.com/api/questions");

                setPreguntas(res.data.data);
            } catch (error) {
                console.error("Error cargando preguntas", error);
            }
        };

        fetchPreguntas();
    }, []);

    const handleChange = (preguntaId, valor) => {
        setRespuestas({
            ...respuestas,
            [preguntaId]: valor,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const pregunta of preguntas) {
            if (!respuestas[pregunta.id]) {
                alert("Responde todas las preguntas");
                return;
            }
        }
        const resultadoCalculado = calcularResultados(respuestas);

        const answers = preguntas.map((pregunta) => ({
            question_id: pregunta.id,
            question_title: pregunta.title,
            score: respuestas[pregunta.id],
        }));


        try {
            // ✅ Enviar al backend
            const response = await axios.post("https://encuesta-6b87.onrender.com/surveys", {
                respondent_name: "Anonimo",
                suggestion: respuestas.sugerencias || "",
                answers,
            });

            // ✅ Crear objeto local (para demo / historial)
            const encuestaCompleta = {
                id: Date.now(),
                fecha: new Date().toLocaleString(),
                respuestas,
                sugerencia: respuestas.sugerencias || "",
                resultado: resultadoCalculado,
            };

            // ✅ Guardar en localStorage
            const historial = JSON.parse(localStorage.getItem("encuestas")) || [];
            historial.push(encuestaCompleta);
            localStorage.setItem("encuestas", JSON.stringify(historial));

            // ✅ Actualizar UI
            setResultado(resultadoCalculado);
            setRespuestas({});
            setListaEncuestas(historial);

        } catch (error) {
            console.error("Error enviando encuesta:", error);
            alert("Error al enviar la encuesta");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-2xl transition-all"
            >
                <div className="flex items-center justify-center gap-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Encuesta de Satisfacción
                    </h1>
                    <img
                        src="https://marketeando.pe/wp-content/uploads/2024/04/logo-marketeando-qk3c4only7ldrluzhpk751uxolo1j7fbxk3x91c75q.png"
                        alt="Logo"
                        className="h-20 w-auto" // Ajusta el tamaño aquí
                    />
                </div>

                <p className="text-sm text-gray-600 mb-6 text-center">
                    Califique del 1 al 5 donde 1 = Nada satisfecho y 5 = Muy satisfecho
                </p>

                <div className="space-y-6">
                    {preguntas.map((pregunta) => (
                        <div
                            key={pregunta.id}
                            className="p-4 border rounded-xl hover:shadow-md transition"
                        >
                            <h2 className="font-semibold text-lg mb-1">
                                {pregunta.title}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                {pregunta.description}
                            </p>

                            <div className="flex justify-between md:justify-start md:gap-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <label
                                        key={num}
                                        className={`cursor-pointer flex flex-col items-center justify-center w-10 h-10 rounded-full border transition-all
                      ${respuestas[pregunta.id] === num
                                                ? "bg-black text-white scale-110"
                                                : "hover:bg-gray-200"}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`pregunta-${pregunta.id}`}
                                            className="hidden"
                                            onChange={() => handleChange(pregunta.id, num)}
                                        />
                                        {num}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <h2 className="font-semibold mb-2">Sugerencias</h2>
                    <textarea
                        className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                        rows="4"
                        value={respuestas.sugerencias || ""}
                        placeholder="Escriba aquí sus comentarios..."
                        onChange={(e) => handleChange("sugerencias", e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-[#ff5400] text-white py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Enviar encuesta
                </button>
                {resultado && (
                    <div className="mt-6 p-5 rounded-xl bg-gray-50 border animate-fade-in">
                        <h2 className="font-bold text-lg mb-3 text-center">
                            Resultados
                        </h2>

                        <div className="p-4 border rounded-xl bg-white shadow-sm">
                            <p className="font-semibold">📊 Total: {resultado.totalRespuestas}</p>
                            <p className="font-semibold">➕ Suma: {resultado.suma}</p>
                            <p className="font-semibold">
                                ⭐ {resultado.promedio}
                            </p>
                            <p className="mt-2 text-center font-medium">
                                {resultado.promedio >= 4
                                    ? "🟢 Excelente"
                                    : resultado.promedio >= 3
                                        ? "🟡 Regular"
                                        : "🔴 Deficiente"}
                            </p>
                        </div>

                    </div>
                )}

            </form>
        </div>
    );
}
