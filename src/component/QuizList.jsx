import { Link } from "react-router-dom";

export default function QuizList({ quizzes }) {
  if (!quizzes || quizzes.length === 0) {
    return <p className="text-gray-500">Aucun quiz trouvé.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quiz disponibles</h2>
      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          className="bg-white p-4 mb-4 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
          <p className="text-gray-600 mb-3">
            {quiz.questions.length} questions
          </p>
          <Link
            to={`/quiz/${quiz._id}/play`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Jouer
          </Link>
        </div>
      ))}
    </div>
  );
}
