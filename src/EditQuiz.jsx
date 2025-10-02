import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizForm from "./component/QuizForm";
import { getQuizById, updateQuiz } from "./service/quizService";

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizById(id);
        setQuiz(res.data); // contient { title, questions, _id, author }
      } catch (err) {
        console.error("Erreur lors de la récupération du quiz :", err);
        alert("Impossible de récupérer le quiz !");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleUpdateQuiz = async ({ title, questions }) => {
    try {
      const token = localStorage.getItem("token");
      await updateQuiz(id, { title, questions }, token);
      alert("✅ Quiz modifié avec succès !");
      navigate("/home");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du quiz :", err);
      alert(err.response?.data?.message || "Erreur lors de la mise à jour du quiz.");
    }
  };

  if (loading) return <p>Chargement du quiz...</p>;
  if (!quiz) return <p>Quiz introuvable.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Modifier le Quiz</h1>
      <div className="bg-white shadow p-6 rounded">
        <QuizForm
          initialTitle={quiz.title}
          initialQuestions={quiz.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))}
          onSubmit={handleUpdateQuiz}
          submitLabel="Sauvegarder les modifications"
        />
      </div>
    </div>
  );
}
