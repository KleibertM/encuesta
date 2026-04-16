import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [distribution, setDistribution] = useState([]);

    const API = "http://localhost:3001";

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            const [summaryRes, trendRes] = await Promise.all([
                axios.get(`${API}/dashboard/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API}/dashboard/trend?group_by=day`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setSummary(summaryRes.data.data);
            setTrend(trendRes.data.data);
        } catch (err) {
            console.error(err);
            alert("Error cargando dashboard");
        }
    };

    const fetchDistribution = async () => {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/dashboard/distribution`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setDistribution(res.data.data);
    };

    useEffect(() => {
    fetchData();
    fetchDistribution(); // 👈 FALTABA ESTO
}, []);

    if (!summary) return <p className="p-6">Cargando dashboard...</p>;


    

    const distributionFlat = distribution.flatMap((q) =>
        Object.entries(q.distribucion).map(([score, frecuencia]) => ({
            question: q.question_title,
            score: Number(score),
            frecuencia,
        }))
    );
    return (
        <div className="p-6 space-y-6">

            {/* 📊 KPIs */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <p className="text-gray-500">Total Encuestas</p>
                    <h2 className="text-3xl font-bold">
                        {summary.total_encuestas}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <p className="text-gray-500">Promedio General</p>
                    <h2 className="text-3xl font-bold">
                        ⭐ {summary.promedio_general}
                    </h2>
                </div>
            </div>

            {/* 📊 Promedio por pregunta */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-4">
                    Promedio por Pregunta
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={summary.por_pregunta}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="question_title" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="promedio" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 📈 Tendencia */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-4">
                    Tendencia de Encuestas
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionFlat}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="frecuencia" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}