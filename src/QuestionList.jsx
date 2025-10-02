import QuestionCard from "./QuestionCard";

export default function QuizList({ quizzes }) {
  if (!quizzes || quizzes.length === 0) {
    return <p className="text-gray-500">Aucun quiz trouvé.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quiz existants</h2>
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="bg-white p-4 mb-4 rounded shadow">
          <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>

          {quiz.questions.map((q, qIndex) => (
            <QuestionCard key={qIndex} question={q} index={qIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}
