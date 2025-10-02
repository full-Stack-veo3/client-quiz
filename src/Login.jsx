import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api/api"; // <--- utilise l'instance axios

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      // ✅ Sauvegarde du token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Redirection selon rôle
      if (res.data.user.role === "admin") {
        navigate("/home"); // admin → dashboard
      } else {
        navigate("/ram");  // user → attend/participe au quiz
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Connexion
        </h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white font-medium py-2 px-4 rounded-lg transition`}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Pas encore inscrit ?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
