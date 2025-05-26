"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

interface ChatResponse {
  chat_id: string;
  answer: string;
  source_previews?: Array<{
    filename: string;
    chunk_id: number;
    text: string;
  }>;
  latency: number;
}

interface ChatHistoryEntry {
  chat_id: string;
  query: string;
  response: string;
  timestamp: number;
}

export default function Chat() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatHistoryEntry | null>(null);

  useEffect(() => {
    // Generate a token for local testing
    const savedToken = localStorage.getItem("chat_token");
    if (!savedToken) {
      const newToken = uuidv4();
      localStorage.setItem("chat_token", newToken);
      setToken(newToken);
    } else {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchChatHistory();
    }
  }, [token]);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get("/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Failed to fetch chat history.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setSelectedChat(null);

    try {
      const res = await axios.post<ChatResponse>(
        "/api/chat",
        { query },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResponse(res.data);
      setQuery("");
      await fetchChatHistory(); // Refresh history
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Failed to get a response.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      await axios.delete("/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
      setResponse(null);
      setSelectedChat(null);
      setQuery("");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Failed to clear chat history.");
    }
  };

  const handleDeleteChat = async (chat_id: string) => {
    try {
      await axios.delete(`/api/chat?chat_id=${chat_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(history.filter((entry) => entry.chat_id !== chat_id));
      if (selectedChat?.chat_id === chat_id) {
        setSelectedChat(null);
        setResponse(null);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Failed to delete chat.");
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ width: "250px", borderRight: "1px solid #ccc", paddingRight: "10px" }}>
        <h2>Chat History</h2>
        <button onClick={handleNewChat} style={{ marginBottom: "10px" }}>
          New Chat
        </button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {history.map((entry) => (
            <li
              key={entry.chat_id}
              style={{
                padding: "5px",
                cursor: "pointer",
                background: selectedChat?.chat_id === entry.chat_id ? "#e0e0e0" : "transparent",
              }}
              onClick={() => {
                setSelectedChat(entry);
                setResponse({ chat_id: entry.chat_id, answer: entry.response, source_previews: [], latency: 0 });
              }}
            >
              {entry.query.substring(0, 30)}...
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(entry.chat_id);
                }}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, paddingLeft: "20px" }}>
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
                      <strong>{source.filename}</strong> (Chunk {source.chunk_id}):{" "}
                      {source.text}...
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p>Latency: {response.latency} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}