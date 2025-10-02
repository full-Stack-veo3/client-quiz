import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function RAM() {
  const [status, setStatus] = useState("⏳ En attente d'un quiz...");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; // 🔥 dynamique depuis .env

  useEffect(() => {
    console.log("📡 Connexion socket RAM…");

   const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);
    newSocket.on("connect", () => {
  console.log("✅ Connecté au serveur socket avec ID:", newSocket.id);
});


    // Réception quiz actif
    newSocket.on("active_quiz", ({ quizId }) => {
      if (quizId) {
        console.log("🎮 Quiz actif trouvé:", quizId);
        setStatus(`✅ Quiz disponible (ID: ${quizId})`);
        navigate(`/quiz/${quizId}/live`); // Redirection automatique
      } else {
        setStatus("⏳ Aucun quiz lancé pour l’instant.");
      }
    });

    return () => newSocket.disconnect();
  }, [navigate]);

  // --- Au clic, demander au serveur le quiz actif ---
  const handleGoToLive = () => {
    if (!socket) return;
    setStatus("🔍 Recherche du quiz actif…");
    socket.emit("get_active_quiz");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">🎮 Interface RAM</h1>
      <p className="mb-4">{status}</p>
      <button
        onClick={handleGoToLive}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow"
      >
        🚀 Rejoindre le quiz
      </button>
    </div>
  );
}
