import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";


export default function LiveQuiz() {
  const { id: quizId } = useParams(); // récupère l'ID du quiz depuis l’URL
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("⏳ En attente du quiz...");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
 const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; // 🔥 dynamique

  useEffect(() => {
    console.log("📡 Connexion socket joueur…");

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });


    setSocket(newSocket);

    // ✅ Rejoindre la room du quiz
    newSocket.emit("join_quiz", { quizId, username: "Player", role: "player" });

    // --- Quand le quiz démarre ---
    newSocket.on("quiz_started", (data) => {
      setStatus(`🎬 Quiz "${data.title}" démarré !`);
      console.log("Quiz démarré:", data);
    });

    // --- Nouvelle question ---
    newSocket.on("show_question", ({ index, question }) => {
      setCurrentQuestion({ index, ...question });
      setStatus(`Question ${index + 1}`);
    });

    // --- Accusé de réception de la réponse ---
    newSocket.on("answer_ack", ({ qIndex, answer }) => {
      console.log(`✅ Réponse enregistrée: Q${qIndex} -> ${answer}`);
    });

    // --- Fin du quiz ---
    newSocket.on("quiz_finished", (data) => {
      console.log("🏁 Quiz terminé:", data);
      setFinished(true);
      setStatus("✅ Quiz terminé !");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [quizId]);

  // --- Envoyer une réponse ---
  const sendAnswer = (answer) => {
    if (!socket || !currentQuestion) return;

    socket.emit("answer", {
      quizId,
      qIndex: currentQuestion.index,
      answer,
    });

    setAnswers((prev) => [...prev, { qIndex: currentQuestion.index, answer }]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🎮 Live Quiz</h1>
      <p className="text-gray-700 mb-4">{status}</p>

      {/* Question en cours */}
      {currentQuestion && !finished && (
        <div className="p-6 bg-white shadow rounded-lg w-96">
          <h2 className="text-lg font-semibold mb-4">
            {currentQuestion.question}
          </h2>
          <div className="space-y-2">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => sendAnswer(opt)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Résultats */}
      {finished && (
        <div className="mt-6 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">📊 Tes réponses</h2>
          <ul className="list-disc list-inside">
            {answers.map((a, i) => (
              <li key={i}>
                Q{a.qIndex + 1}: <strong>{a.answer}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
