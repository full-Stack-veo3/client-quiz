import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes } from "./service/quizService";

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  // ✅ Récupérer infos user depuis localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log("🟢 useEffect déclenché → fetchQuizzes()");
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      console.log("📡 Appel API → getQuizzes()");
      const res = await getQuizzes();
      console.log("✅ Réponse API :", res.data);
      setQuizzes(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération quiz :", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center">📋 Liste des Quiz</h1>

      {/* ✅ Si user est admin → boutons Admin */}
      {user?.role === "admin" && (
        <div className="text-center mb-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/admin-quiz")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow"
          >
            🛠️ Gérer les Quiz
          </button>
          <button
            onClick={() => navigate("/admin-quiz/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            ➕ Ajouter un Quiz
          </button>
        </div>
      )}

      {quizzes.length === 0 ? (
        <p className="text-center text-gray-600">⚠️ Aucun quiz pour l’instant.</p>
      ) : (
        <ul className="space-y-6">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="p-6 border rounded shadow-md bg-white">
              {/* Titre du quiz */}
              <h2 className="text-xl font-semibold mb-3">{quiz.title}</h2>

              {/* Liste des questions */}
              <ul className="ml-4 list-disc">
                {quiz.questions.map((q, idx) => (
                  <li key={q._id || idx} className="mb-2">
                    <span className="font-medium">{q.question}</span>
                    <ul className="ml-6 list-decimal">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={i === q.correctAnswer ? "text-green-600 font-semibold" : ""}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => navigate(`/quiz/${quiz._id}/play`)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  ▶️ Jouer (solo)
                </button>
                <button
                  onClick={() => navigate(`/quiz/${quiz._id}/live`)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  🎮 Rejoindre (live)
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}/edit`)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                  >
                    ✏️ Modifier
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
