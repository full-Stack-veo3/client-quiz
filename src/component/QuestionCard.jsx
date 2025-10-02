import React from "react";

function QuestionCard({ question, options, onAnswer }) {
  return (
    <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
      <h3>{question}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {options.map((opt, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>
            <button onClick={() => onAnswer(opt)}>{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionCard; // ✅ Export par défaut
