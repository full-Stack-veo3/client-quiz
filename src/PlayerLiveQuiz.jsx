import { useEffect, useState } from "react";
import socket from "./socket";

export default function PlayerLiveQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    socket.on("quiz_started", (quiz) => {
      setQuizStarted(true);
      setFinished(false);
      setCurrentQuestion(null);
    });

    socket.on("show_question", ({ index, question }) => {
      setCurrentQuestion({ ...question, index });
      setAnswer(null);
    });

    socket.on("quiz_finished", () => {
      setFinished(true);
      setCurrentQuestion(null);
    });

    return () => {
      socket.off("quiz_started");
      socket.off("show_question");
      socket.off("quiz_finished");
    };
  }, []);

  const sendAnswer = (optIndex) => {
    if (!currentQuestion) return;
    setAnswer(optIndex);
    socket.emit("answer", { qIndex: currentQuestion.index, answer: optIndex });
  };

  if (!quizStarted)
    return <p className="text-center mt-10">⏳ En attente que l’admin démarre le quiz...</p>;

  if (finished)
    return <p className="text-center mt-10 text-green-600 font-bold">🎉 Quiz terminé !</p>;

  if (!currentQuestion) return <p className="text-center mt-10">⏳ En attente de la prochaine question...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">❓ {currentQuestion.question}</h2>
      <div className="space-y-2">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => sendAnswer(idx)}
            className={`w-full px-4 py-2 rounded border ${
              answer === idx ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {answer !== null && <p className="mt-3 text-blue-600">✅ Réponse envoyée</p>}
    </div>
  );
}
