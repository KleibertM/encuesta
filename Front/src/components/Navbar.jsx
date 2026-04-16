export default function Navbar({ user, onLoginClick, onLogout, view, onViewChange }) {

    return (
        <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

            {/* 🧩 Logo */}
            <div className="flex items-center gap-2 font-bold text-lg">
                <span className="bg-black text-white px-2 py-1 rounded">ES</span>
                <span>Encuestas</span>
            </div>

            {/* 🔐 Acciones */}
            <div>
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="p-4 bg-white text-black flex gap-4">
                            <button  className="hover:bg-gray-200 px-2 py-1 rounded" onClick={() => onViewChange("dashboard")}>
                                Dashboard
                            </button>

                            <button className="hover:bg-gray-200 px-2 py-1 rounded" onClick={() => onViewChange("questions")}>
                                Preguntas
                            </button>
                        </div>
                        <span className="text-sm">👤 {user.name}</span>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Admin Login
                    </button>
                )}
            </div>
        </nav>
    );
}