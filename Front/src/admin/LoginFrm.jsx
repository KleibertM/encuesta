import { useState } from "react";
import axios from "axios";

export default function LoginFrm({ onLogin, onClose }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("https://encuesta-6b87.onrender.com/auth/login", form);

      const { token, user } = res.data;

      // 🔥 Guardar token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);

    } catch (err) {
      console.error(err);
      alert("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow w-full max-w-sm"
      >
         <button
      type="button"
      onClick={onClose}
      className="absolute top-2 right-3 text-gray-500"
    >
      ✕
    </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Ingresar Admin
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}