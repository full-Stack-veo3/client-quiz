import axios from "axios";

// Détection auto de l'environnement (Vite fournit DEV/PROD)
const baseURL = import.meta.env.VITE_API_URL;

const API = axios.create({ baseURL });

// Ajouter automatiquement le token si présent
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
