import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.100.29:4000");

function UserQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [username, setUsername] = useState(""); // pseudo utilisateur

  useEffect(() => {
    socket.on("quiz_started", (quiz) => {
      setQuizStarted(true);
      alert(`Le quiz commence: ${quiz.title}`);
    });

    socket.on("show_question", (q) => {
      setQuestion(q);
    });

    return () => {
      socket.off("quiz_started");
      socket.off("show_question");
    };
  }, []);

  const sendAnswer = () => {
    if (!username.trim()) {
      alert("⚠️ Entrez un pseudo avant de répondre !");
      return;
    }
    socket.emit("answer", { answer, user: username });
    setAnswer("");
  };

  return (
    <div className="p-6">
      {!quizStarted ? (
        <p className="text-gray-600">⏳ En attente que l'admin lance le quiz...</p>
      ) : (
        <div>
          {question ? (
            <div>
              <h3 className="text-lg font-bold mb-2">{question.text}</h3>
              
              <input
                type="text"
                placeholder="Votre pseudo..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border px-3 py-2 mr-2 rounded mb-2"
              />

              <div className="mt-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Votre réponse..."
                  className="border px-3 py-2 mr-2 rounded"
                />
                <button
                  onClick={sendAnswer}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  Envoyer
                </button>
              </div>
            </div>
          ) : (
            <p>En attente de la prochaine question...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserQuiz;
