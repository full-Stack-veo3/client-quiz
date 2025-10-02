import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api/api";

export default function NewArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await API.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Article créé avec succès !");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'article");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Créer un nouvel article</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            required
          />
          <textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            required
            rows={5}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-4"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition"
          >
            Publier l'article
          </button>
        </form>
      </div>
    </div>
  );
}
