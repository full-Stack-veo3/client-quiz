import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "./api/api";

export default function PlayQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  // Charger le quiz
  useEffect(() => {
    API.get(`/quiz/${id}/play`).then((res) => {
      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(null));
    });
  }, [id]);

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    const res = await API.post(`/quiz/${id}/check`, { answers });
    setResult(res.data);
  };

  const handleRestart = () => {
    setResult(null);
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(null));
  };

  if (!quiz) return <p className="text-center text-gray-500">⏳ Chargement...</p>;

  // ✅ Après soumission
  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-2xl w-full bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Résultat</h2>
          <p className="text-xl mb-6">
            🎉 Score : {result.score} / {result.total}
          </p>

          {result.corrections.map((corr, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded bg-gray-50 shadow-sm"
            >
              <p className="font-semibold mb-2">
                {index + 1}. {corr.question}
              </p>
              {quiz.questions[index].options.map((opt, optIndex) => {
                let style = "border-gray-300";
                if (optIndex === corr.correct) style = "border-green-500 bg-green-100";
                if (optIndex === corr.chosen && !corr.isCorrect)
                  style = "border-red-500 bg-red-100";

                return (
                  <p key={optIndex} className={`p-2 border rounded mb-1 ${style}`}>
                    {opt}
                  </p>
                );
              })}
            </div>
          ))}

          <button
            onClick={handleRestart}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            🔄 Rejouer le quiz
          </button>
        </div>
      </div>
    );
  }

  // ✅ Pendant le quiz
  const q = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">{quiz.title}</h2>
        <p className="text-gray-600 mb-2">
          Question {currentQuestion + 1} / {quiz.questions.length}
        </p>

        <div className="mb-6">
          <p className="font-semibold text-lg mb-3">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex) => (
              <label
                key={optIndex}
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition ${
                  answers[currentQuestion] === optIndex
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={`q${currentQuestion}`}
                  checked={answers[currentQuestion] === optIndex}
                  onChange={() => handleAnswer(optIndex)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            disabled={answers[currentQuestion] === null}
          >
            Suivant ➡️
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
            disabled={answers[currentQuestion] === null}
          >
            ✅ Valider mes réponses
          </button>
        )}
      </div>
    </div>
  );
}
