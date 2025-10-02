import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./SignUp";
import Logout from "./Logout";
import Login from "./login";
import LiveQuiz from "./LiveQuiz";

import RAM from "./Ram"; // ✅ nouvel import

// Imports Admin
import PlayQuiz from "./PlayQuiz";
import EditQuiz from "./EditQuiz";
import AdminRoute from "./AdminRoute";
import AdminQuiz from "./AdminQuiz";
import UserQuiz from "./UserQuiz";
import AdminQuizControl from "./AdminQuizControl";
import AdminLive from "./AdminLive";
import Home from "./home";
import Home2 from "./Home2";
import NewArticle from "./NewArticle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth accessibles aux utilisateurs */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/logout" element={<Logout />} />

        {/* Page RAM + Live Quiz accessibles aux utilisateurs */}
        <Route path="/ram" element={<RAM />} />        {/* ✅ nouvelle page */}
        <Route path="/quiz/:id/live" element={<LiveQuiz />} />

        {/* Toutes les autres routes protégées admin */}
        <Route
          path="/home"
          element={
            <AdminRoute>
              <Home />
            </AdminRoute>
          }
        />
        <Route
          path="/home2"
          element={
            <AdminRoute>
              <Home2 />
            </AdminRoute>
          }
        />
        <Route
          path="/new-article"
          element={
            <AdminRoute>
              <NewArticle />
            </AdminRoute>
          }
        />
        <Route
          path="/quiz/:id/play"
          element={
            <AdminRoute>
              <PlayQuiz />
            </AdminRoute>
          }
        />
        <Route
          path="/user"
          element={
            <AdminRoute>
              <UserQuiz />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-quiz"
          element={
            <AdminRoute>
              <AdminQuiz />
            </AdminRoute>
          }
        />
        <Route
          path="/quiz/:id/edit"
          element={
            <AdminRoute>
              <EditQuiz />
            </AdminRoute>
          }
        />
        <Route
          path="/quiz/:id/admin"
          element={
            <AdminRoute>
              <AdminQuizControl />
            </AdminRoute>
          }
        />
        <Route
  path="/admin/live/:id"
  element={
    <AdminRoute>
      <AdminLive />
    </AdminRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
