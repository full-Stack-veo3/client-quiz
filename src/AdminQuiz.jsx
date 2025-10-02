// AdminQuiz.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes, deleteQuiz } from "./service/quizService";

export default function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await getQuizzes();
      setQuizzes(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération quiz :", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce quiz ?")) return;
    try {
      await deleteQuiz(id, localStorage.getItem("token"));
      setQuizzes(quizzes.filter((q) => q._id !== id));
    } catch (err) {
      console.error("❌ Erreur suppression quiz :", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center">⚙️ Gestion des Quiz</h1>

      {quizzes.length === 0 ? (
        <p>Aucun quiz créé.</p>
      ) : (
        <ul className="space-y-6">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="p-6 border rounded shadow-md bg-white">
              {/* Titre du quiz */}
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>

              {/* Questions */}
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

              {/* Actions admin */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/admin/edit/${quiz._id}`)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  🗑 Supprimer
                </button>
                <button
                  onClick={() => navigate(`/admin/live/${quiz._id}`)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  🚀 Lancer le Quiz
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
