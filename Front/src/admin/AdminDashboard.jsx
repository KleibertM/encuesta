// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     CartesianGrid,
//     LineChart,
//     Line,
//     ResponsiveContainer,
// } from "recharts";

// export default function AdminDashboard() {
//     const [summary, setSummary] = useState(null);
//     const [trend, setTrend] = useState([]);
//     const [distribution, setDistribution] = useState([]);
//     const COLORS = ['#FF5400', '#00C49F', '#0088FE', '#FFBB28', '#8884d8', '#82ca9d'];

//     const API2 = "https://encuesta-6b87.onrender.com";
//     const API = "http://localhost:3000";
//     const fetchData = async () => {
//         try {
//             const token = localStorage.getItem("token");

//             const [summaryRes, trendRes] = await Promise.all([
//                 axios.get(`${API2}/dashboard/summary`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }),
//                 axios.get(`${API2}/dashboard/trend?group_by=day`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }),
//             ]);

//             setSummary(summaryRes.data.data);
//             setTrend(trendRes.data.data);
//         } catch (err) {
//             console.error(err);
//             alert("Error cargando dashboard");
//         }
//     };

//     const fetchDistribution = async () => {
//         const token = localStorage.getItem("token");

//         const res = await axios.get(`${API2}/dashboard/distribution`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         setDistribution(res.data.data);
//     };

//     useEffect(() => {
//     fetchData();
//     fetchDistribution(); // 👈 FALTABA ESTO
// }, []);

//     if (!summary) return <p className="p-6">Cargando dashboard...</p>;

//     const distributionFlat = distribution.flatMap((q) =>
//         Object.entries(q.distribucion).map(([score, frecuencia]) => ({
//             question: q.question_title,
//             score: Number(score),
//             frecuencia,
//         }))
//     );
//     return (
//         <div className="p-6 space-y-6">

//             {/* 📊 KPIs */}
//             <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-white p-6 rounded-xl shadow text-center">
//                     <p className="text-gray-500">Total Encuestas</p>
//                     <h2 className="text-3xl font-bold">
//                         {summary.total_encuestas}
//                     </h2>
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow text-center">
//                     <p className="text-gray-500">Promedio General</p>
//                     <h2 className="text-3xl font-bold">
//                         ⭐ {summary.promedio_general}
//                     </h2>
//                 </div>
//             </div>

//             {/* 📊 Promedio por pregunta */}
//             <div className="bg-white p-6 rounded-xl shadow">
//                 <h3 className="font-bold mb-4">
//                     Promedio por Pregunta
//                 </h3>

//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={summary.por_pregunta}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="question_title" />
//                         <YAxis domain={[0, 5]} />
//                         <Tooltip />
//                         <Bar dataKey="promedio" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* 📈 Tendencia */}
//             <div className="bg-white p-6 rounded-xl shadow">
//                 <h3 className="font-bold mb-4">
//                     Tendencia de Encuestas
//                 </h3>

//                 <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={trend}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="fecha" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="total" />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={distributionFlat}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="score" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="frecuencia" />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, Cell, XAxis, YAxis, Tooltip,
    CartesianGrid, LineChart, Line, ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [distribution, setDistribution] = useState([]);

    // Paleta de colores para las barras
    const COLORS = ['#FF5400', '#00C49F', '#0088FE', '#FFBB28', '#8884d8', '#82ca9d'];

    const API2 = "https://encuesta-6b87.onrender.com";

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [summaryRes, trendRes, questionsRes] = await Promise.all([
                axios.get(`${API2}/dashboard/summary`, { headers }),
                axios.get(`${API2}/dashboard/trend?group_by=day`, { headers }),
                axios.get(`${API2}/api/questions`, { headers }),
            ]);
            console.log(summaryRes);

            // 🔥 FILTRADO: Solo guardamos preguntas que tengan is_active: true
            const activeIds = questionsRes.data.data
                .filter(q => q.is_active)
                .map(q => q.id);

            // 2. Filtramos el resumen para que SOLO tenga esas preguntas
            const filteredSummary = {
                ...summaryRes.data.data,
                por_pregunta: summaryRes.data.data.por_pregunta
                    .filter(p => activeIds.includes(p.question_id))
                // Opcional: .slice(-5) si solo quieres las últimas 5
            };

            setSummary(filteredSummary);
            setTrend(trendRes.data.data);
        } catch (err) {
            console.error(err);
            alert("Error cargando dashboard");
        }
    };

    const fetchDistribution = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API2}/dashboard/distribution`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 🔥 FILTRADO: Solo distribución de preguntas activas
            const filteredDist = res.data.data.filter(q => q.is_active);
            setDistribution(filteredDist);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDistribution();
    }, []);

    if (!summary) return <p className="p-6">Cargando dashboard...</p>;

    // Aplanamos la distribución ya filtrada
    const distributionFlat = distribution.flatMap((q) =>
        Object.entries(q.distribucion).map(([score, frecuencia]) => ({
            question: q.question_title,
            score: Number(score),
            frecuencia,
        }))
    );

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* 📊 KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow text-center border-t-4 border-[#FF5400]">
                    <p className="text-gray-500 uppercase text-xs font-bold">Total Encuestas</p>
                    <h2 className="text-4xl font-black text-gray-800">{summary.total_encuestas}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow text-center border-t-4 border-green-500">
                    <p className="text-gray-500 uppercase text-xs font-bold">Promedio General</p>
                    <h2 className="text-4xl font-black text-gray-800">⭐ {summary.promedio_general}</h2>
                </div>
            </div>

            {/* 📊 Promedio por pregunta activa con colores */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-4 text-gray-700">Promedio por Pregunta (Solo Activas)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={summary.por_pregunta}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="question_title" tick={{ fontSize: 10 }} interval={0} />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="promedio" radius={[5, 5, 0, 0]}>
                            {summary.por_pregunta.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 📈 Tendencia */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-4 text-gray-700">Tendencia de Encuestas</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#FF5400" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}