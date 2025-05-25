"use client";

import { useState, FormEvent } from "react";
import axios from "axios";

interface SourcePreview {
  filename: string;
  chunk_id: number;
  text: string;
}

interface ChatResponse {
  answer: string;
  source_previews: SourcePreview[];
  latency: number;
}

export default function Chat() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const backendUrl = "http://localhost:8000/chat";
      const res = await axios.post(backendUrl, { query }, {
        headers: { "Content-Type": "application/json" },
      });

      setResponse(res.data);
    } catch (err) {
      setError("Failed to get a response. Check the backend or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Legal Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a legal question (e.g., What are my rights to property division?)"
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h2>Response:</h2>
          <p>{response.answer}</p>
          {response.source_previews && response.source_previews.length > 0 && (
            <>
              <h3>Sources:</h3>
              <ul>
                {response.source_previews.map((source, index) => (
                  <li key={index}>
                    <strong>{source.filename}</strong> (Chunk {source.chunk_id}): {source.text}...
                  </li>
                ))}
              </ul>
            </>
          )}
          <p>Latency: {response.latency} seconds</p>
        </div>
      )}
    </div>
  );
}