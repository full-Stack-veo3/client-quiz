import API from "../api/api";

// Récupérer tous les quiz
export const getQuizzes = () => API.get("/quiz");

// Récupérer un quiz par son ID
export const getQuizById = (id) => {
  const token = localStorage.getItem("token");
  return API.get(`/quiz/${id}`, {
    headers: { Authorization: `Bearer ${token}` }, // 🔑 token ici
  });
};


// Créer un quiz (le token est déjà injecté par l’interceptor)
export const createQuiz = (data) => API.post("/quiz", data);

// Modifier un quiz
export const updateQuiz = (id, data) => API.put(`/quiz/${id}`, data);

// Supprimer un quiz
export const deleteQuiz = (id) => API.delete(`/quiz/${id}`);

// Jouer un quiz
export const playQuiz = (id) => API.get(`/quiz/${id}/play`);

// Vérifier un quiz
export const checkQuiz = (id, answers) => API.post(`/quiz/${id}/check`, { answers });
