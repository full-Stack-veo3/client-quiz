import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // Supprime le token
    const timer = setTimeout(() => {
      navigate("/login"); // Redirection après 1.5s
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Déconnexion en cours...
        </h1>
        <p className="text-gray-500">Vous allez être redirigé vers la page de connexion.</p>
      </div>
    </div>
  );
}

export default Logout;
