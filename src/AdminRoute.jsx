import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); 
  // 👆 on suppose que tu stockes {id, name, email, role} après login

  if (!user) {
    return <Navigate to="/login" replace />; // pas connecté → login
  }

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />; // connecté mais pas admin → home
  }

  return children; // sinon, accès autorisé
}
