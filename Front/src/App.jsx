import AdminQuestions from './admin/AdminQuestions'
import LoginFrm from './admin/LoginFrm';
import EncuestaForm from './components/EncuestaForm'
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
     <div className="min-h-screen bg-gray-100">

      {/* 🔝 NAVBAR */}
      <Navbar
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        view={view}
        onViewChange={setView}
      />
      {user && view === "dashboard" && <AdminDashboard />}
      {user && view === "questions" && <AdminQuestions />}

      {/* 🔐 LOGIN MODAL */}
      {showLogin && (
        <LoginFrm
          onLogin={(userData) => {
            setUser(userData);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* 🧠 CONTENIDO */}
      <div className="p-4">

        <EncuestaForm />
        

      </div>
    </div>
  )
}

export default App
