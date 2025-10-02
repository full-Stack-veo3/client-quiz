// AdminLive.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById } from "./service/quizService";
import { io } from "socket.io-client";

export default function AdminLive() {
  const {id : quizId } = useParams(); // ID du quiz depuis l'URL
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [socket, setSocket] = useState(null);
  const [answersReceived, setAnswersReceived] = useState([]);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

  // --- 1️⃣ Initialisation Socket.io ---
  useEffect(() => {
    console.log("🔌 Connexion Socket.io...");
    const s = io(SOCKET_URL, { transports: ["websocket", "polling"] });

    s.on("connect", () => {
      console.log("✅ Connecté au serveur Socket.io :", s.id);
      // Rejoindre la room quiz en tant qu'admin
      s.emit("join_quiz", { quizId, username: "Admin", role: "admin" });
    });

    // Quiz démarré
    s.on("quiz_started", (data) => {
      console.log("🚀 Quiz démarré :", data);
      setCurrentIndex(-1);
      setAnswersReceived([]);
    });

    // Nouvelle question
    s.on("show_question", ({ index, question }) => {
      console.log(`📌 Question ${index + 1} envoyée`, question);
      setCurrentIndex(index);
      setCurrentQuestion(question);
    });

    // Quiz terminé
    s.on("quiz_finished", (data) => {
      console.log("🏁 Quiz terminé !", data);
      alert("Le quiz est terminé !");
      setCurrentIndex(-1);
      setCurrentQuestion(null);
    });

    // Réponse reçue d'un joueur
    s.on("answer_received", ({ user, qIndex, answer }) => {
      console.log(`✅ Réponse reçue de ${user} pour Q${qIndex + 1}:`, answer);
      setAnswersReceived((prev) => [...prev, { user, qIndex, answer }]);
    });

    s.on("disconnect", () => {
      console.log("❌ Déconnecté du serveur Socket.io");
    });

    setSocket(s);

    return () => {
      s.disconnect();
      console.log("🛑 Socket déconnecté au cleanup");
    };
  }, [quizId]);

  // --- 2️⃣ Récupérer quiz depuis le backend ---
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log("📡 Récupération quizId =", quizId);
        const res = await getQuizById(quizId);
        console.log("✅ Quiz récupéré :", res.data);
        setQuiz(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération quiz :", err);
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  // --- 3️⃣ Lancer le quiz ---
  const startQuiz = () => {
    if (!socket) return console.warn("⚠️ Socket non connecté");
    console.log("🎬 Lancer le quiz via Socket.io...");
    socket.emit("start_quiz", { quizId });
  };

  // --- 4️⃣ Question suivante ---
  const nextQuestion = () => {
    if (!socket) return console.warn("⚠️ Socket non connecté");
    console.log("➡️ Question suivante...");
    socket.emit("next_question", { quizId });
  };

  if (!quiz) return <p>⏳ Chargement du quiz...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎮 Admin Live Quiz : {quiz.title}
      </h1>

      {/* Boutons lancer / question suivante */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={startQuiz}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          🚀 Lancer le quiz
        </button>
        <button
          onClick={nextQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={currentIndex >= quiz.questions.length - 1}
        >
          ➡️ Question suivante
        </button>
      </div>

      {/* Affichage de la question courante côté admin */}
      {currentQuestion && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Question {currentIndex + 1} :
          </h2>
          <p className="mb-2">{currentQuestion.question}</p>
          <ul className="list-disc ml-6">
            {currentQuestion.options.map((opt, i) => (
              <li
                key={i}
                className={
                  i === currentQuestion.correctAnswer
                    ? "font-bold text-green-600"
                    : ""
                }
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Réponses reçues */}
      {answersReceived.length > 0 && (
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Réponses reçues :</h3>
          <ul className="ml-4">
            {answersReceived.map((a, idx) => (
              <li key={idx}>
                {a.user} → Q{a.qIndex + 1}: {quiz.questions[a.qIndex].options[a.answer]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
