import { useState, useEffect } from "react";
import API from "./api";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Charger les articles
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await API.get("/articles");
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Créer ou mettre à jour un article
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/articles/${editingId}`, { title, content });
      } else {
        await API.post("/articles", { title, content });
      }
      setTitle("");
      setContent("");
      setEditingId(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (article) => {
    setTitle(article.title);
    setContent(article.content);
    setEditingId(article._id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          required
        />
        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          {editingId ? "Modifier" : "Créer"}
        </button>
      </form>

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article._id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{article.title}</h2>
            <p className="text-gray-700 mb-2">{article.content}</p>
            <p className="text-sm text-gray-500">
              Auteur: {article.author.name} ({article.author.email})
            </p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(article)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(article._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
