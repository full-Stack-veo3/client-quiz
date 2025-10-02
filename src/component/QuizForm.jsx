import { useState } from "react";

export default function QuizForm({
  initialTitle = "",
  initialQuestions = [],
  onSubmit,
  submitLabel,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [questions, setQuestions] = useState(
    initialQuestions.length > 0
      ? initialQuestions
      : [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, questions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "question") newQuestions[index].question = value;
    else if (field === "correctAnswer") newQuestions[index].correctAnswer = parseInt(value);
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message informatif en haut */}
      <p className="text-blue-600 font-medium mb-4">
        Vous pouvez modifier vos questions et changer vos intérêts.
      </p>

      <input
        type="text"
        placeholder="Titre du quiz"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 w-full"
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-3 rounded">
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
            required
            className="border p-2 w-full mb-2"
          />

          {q.options.map((opt, oIndex) => (
            <input
              key={oIndex}
              type="text"
              placeholder={`Option ${oIndex + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
              required
              className="border p-2 w-full mb-1"
            />
          ))}

          <select
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
            className="border p-2 mt-2"
          >
            {q.options.map((_, i) => (
              <option key={i} value={i}>
                Réponse {i + 1}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button type="button" onClick={addQuestion} className="bg-gray-300 px-4 py-2 rounded">
        ➕ Ajouter une question
      </button>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {submitLabel || "Enregistrer"}
      </button>
    </form>
  );
}
