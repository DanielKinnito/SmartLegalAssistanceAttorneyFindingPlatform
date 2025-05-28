"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Menu, PenSquare, Plus, Send } from "lucide-react";

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

export default function AIBot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatHistoryEntry | null>(null);
  const [showChat, setShowChat] = useState(false);

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
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setSelectedChat(null);
    setShowChat(true);

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
      await fetchChatHistory();
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
      setShowChat(false);
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
        setShowChat(false);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Failed to delete chat.");
    }
  };

  return (
    <div className="min-h-screen bg-[#192432] text-white flex">
      {/* Sidebar */}
      <div className="w-[190px] border-r border-[#263a56] flex flex-col">
        <div className="p-4">
          <button
            className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-md py-2 px-3 text-sm"
            onClick={handleNewChat}
          >
            <PenSquare className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="px-4 py-2 flex-1">
          <h3 className="text-sm text-white/70 mb-2">Recent</h3>
          <div className="space-y-1">
            {history.map((entry) => (
              <div
                key={entry.chat_id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  selectedChat?.chat_id === entry.chat_id ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={() => {
                  setSelectedChat(entry);
                  setResponse({ chat_id: entry.chat_id, answer: entry.response, source_previews: [], latency: 0 });
                  setShowChat(true);
                }}
              >
                <span className="text-sm truncate">{entry.query.substring(0, 20)}...</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(entry.chat_id);
                  }}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4">
          <button className="w-full flex items-center justify-center p-2 hover:bg-white/10 rounded-md">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!showChat ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold mb-8">What can I help you with?</h1>
              <div className="w-full max-w-2xl px-4">
                <div className="relative">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                      placeholder="Ask a legal question (e.g., What are my rights to property division?)"
                      className="w-full bg-transparent border border-[#29374a] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-[#4a5d78]"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                      onClick={() => document.querySelector("input")?.focus()}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>
                </div>
                {error && <p className="text-red-400 mt-2">{error}</p>}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                {selectedChat ? (
                  <div className="mb-4 max-w-3xl">
                    <div className="p-3 rounded-lg bg-[#263a56] text-white">
                      {selectedChat.query}
                    </div>
                    <div className="p-3 rounded-lg bg-[#29374a] text-white mt-2">
                      {selectedChat.response}
                    </div>
                  </div>
                ) : (
                  response && (
                    <div className="mb-4 max-w-3xl ml-auto">
                      <div className="p-3 rounded-lg bg-[#263a56] text-white">{query}</div>
                      <div className="p-3 rounded-lg bg-[#29374a] text-white mt-2">
                        {response.answer}
                        {response.source_previews && response.source_previews.length > 0 && (
                          <div className="mt-2">
                            <h3 className="text-sm text-white/70">Sources:</h3>
                            <ul className="list-disc pl-5 text-sm">
                              {response.source_previews.map((source, index) => (
                                <li key={index}>
                                  <strong>{source.filename}</strong> (Chunk {source.chunk_id}): {source.text}...
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p className="text-sm text-white/70 mt-2">Latency: {response.latency} seconds</p>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="p-4 border-t border-[#263a56]">
                <div className="max-w-3xl mx-auto relative">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                      placeholder="Type your message..."
                      className="w-full bg-transparent border border-[#29374a] rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-[#4a5d78]"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : <Send className="w-5 h-5" />}
                    </button>
                  </form>
                  {error && <p className="text-red-400 mt-2">{error}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}