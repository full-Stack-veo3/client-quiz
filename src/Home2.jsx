import { useNavigate } from "react-router-dom";

export default function Home2() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎮 Live Quiz</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/admin")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          👨‍💻 Admin
        </button>
        <button
          onClick={() => navigate("/player")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
        >
          🙋 Joueur
        </button>
      </div>
    </div>
  );
}
