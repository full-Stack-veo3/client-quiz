import { useEffect, useState } from "react";
import API from "./api/api";

export default function AdminQuizController({ quizId }) {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    API.get(`/quiz/${quizId}`).then((res) => setQuiz(res.data));
  }, [quizId]);

  const handleLaunchNext = async () => {
    if (currentQuestion < quiz.questions.length) {
      // 🚀 Notifier le serveur que la question X doit être lancée
      await API.post(`/quiz/${quizId}/launch`, {
        questionIndex: currentQuestion,
      });

      // Passer à la prochaine question
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (!quiz) return <p>⏳ Chargement du quiz...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎛 Contrôle du quiz</h2>
      <p className="mb-4">Question en cours : {currentQuestion + 1}</p>

      {currentQuestion < quiz.questions.length ? (
        <button
          onClick={handleLaunchNext}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          🚀 Lancer question {currentQuestion + 1}
        </button>
      ) : (
        <p className="text-green-600 font-bold">✅ Toutes les questions sont lancées</p>
      )}
    </div>
  );
}
