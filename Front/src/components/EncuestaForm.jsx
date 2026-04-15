import { useState } from "react";

export default function EncuestaForm() {
    const [respuestas, setRespuestas] = useState({});
    const [resultado, setResultado] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [listaEncuestas, setListaEncuestas] = useState([]);

    const preguntas = [
        {
            id: 1,
            titulo: "Amabilidad y Empatía",
            descripcion:
                "¿El personal le brindó un trato respetuoso y mantuvo una actitud de escucha durante su atención?",
        },
        {
            id: 2,
            titulo: "Claridad en la Información",
            descripcion:
                "¿Las explicaciones brindadas por el funcionario fueron claras y fáciles de entender?",
        },
        {
            id: 3,
            titulo: "Agilidad y Tiempo de Respuesta",
            descripcion:
                "¿Considera que el tiempo de espera y la duración de su atención fueron eficientes?",
        },
        {
            id: 4,
            titulo: "Capacidad de Gestión",
            descripcion:
                "¿El servidor público demostró conocimiento para orientarlo o gestionar su trámite?",
        },
        {
            id: 5,
            titulo: "Satisfacción General",
            descripcion:
                "En términos generales, ¿qué tan satisfecho se siente con la atención recibida hoy?",
        },
    ];


    const obtenerResumen = () => {
        const historial = JSON.parse(localStorage.getItem("encuestas")) || [];

        if (historial.length === 0) return null;

        const totalEncuestas = historial.length;

        const sumaPromedios = historial.reduce((acc, item) => {
            const promedio = item.resultado?.promedio || item.promedio || 0;
            return acc + parseFloat(promedio);
        }, 0);

        const promedioGeneral = (sumaPromedios / totalEncuestas).toFixed(2);

        return {
            totalEncuestas,
            promedioGeneral,
        };
    };
    const handleChange = (preguntaId, valor) => {
        setRespuestas({
            ...respuestas,
            [preguntaId]: valor,
        });
    };
    const obtenerEncuestas = () => {
        return JSON.parse(localStorage.getItem("encuestas")) || [];
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

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let i = 1; i <= 5; i++) {
            if (!respuestas[i]) {
                alert("Responde todas las preguntas");
                return;
            }
        }

        const resultadoCalculado = calcularResultados(respuestas);

        const encuestaCompleta = {
            id: Date.now(),
            fecha: new Date().toLocaleString(),
            respuestas,
            sugerencia: respuestas.sugerencias || "",
            resultado: resultadoCalculado,
        };
        // 🔥 Guardar en localStorage
        const historial = JSON.parse(localStorage.getItem("encuestas")) || [];

        historial.push(encuestaCompleta);

        localStorage.setItem("encuestas", JSON.stringify(historial));
        setResultado(resultadoCalculado);
        setRespuestas({});
        setListaEncuestas(obtenerEncuestas())
        setResumen(obtenerResumen())

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-2xl transition-all"
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                    Encuesta de Satisfacción
                </h1>

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
                                {pregunta.titulo}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                {pregunta.descripcion}
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
                    className="w-full mt-6 bg-blue-500 text-white py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Enviar encuesta
                </button>

                
                <button
                    type="button"
                    onClick={() => setListaEncuestas(obtenerEncuestas())}
                    className="w-full mt-2 bg-green-500 text-white py-2 rounded-xl"
                >
                    Ver historial de encuestas
                </button>

                <button
                    type="button"
                    onClick={() => setResumen(obtenerResumen())}
                    className="w-full mt-3 bg-red-800 text-white py-2 rounded-xl hover:opacity-80"
                >
                    Ver resultados acumulados
                </button>

                {listaEncuestas.length > 0 && (
                    <div className="mt-6 space-y-4 max-h-80 overflow-y-auto">
                        {listaEncuestas.map((encuesta) => (
                            <div
                                key={encuesta.id}
                                className="p-4 border rounded-xl bg-white shadow-sm"
                            >
                                <p className="text-xs text-gray-500 mb-2">
                                    {encuesta.fecha}
                                </p>

                                <p className="font-semibold">
                                    ⭐ Promedio: {encuesta.resultado.promedio}
                                </p>

                                <p className="font-semibold">
                                    📊 Respuestas:{" "}
                                    {Object.values(encuesta.respuestas)
                                        .filter((v) => typeof v === "number")
                                        .join(" - ")}
                                </p>

                                {encuesta.sugerencia && (
                                    <p className="font-semibold mt-2 italic text-gray-600">
                                        💬 \"{encuesta.sugerencia}\"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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
            </form>
        </div>
    );
}
