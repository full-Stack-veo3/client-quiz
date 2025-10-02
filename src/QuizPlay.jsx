import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function QuizPlay() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://192.168.100.29:4000/api/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error("Erreur récupération quiz:", err);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (index) => {
    if (!quiz) return;

    if (index === quiz.questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (!quiz) return <p>Chargement...</p>;

  if (finished) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">🎉 Quiz terminé !</h2>
        <p className="text-xl">Votre score : {score} / {quiz.questions.length}</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <h2 className="text-lg mb-2">
        Question {currentIndex + 1} / {quiz.questions.length}
      </h2>
      <p className="mb-4 font-medium">{currentQuestion.question}</p>
      <div className="space-y-2">
        {currentQuestion.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
