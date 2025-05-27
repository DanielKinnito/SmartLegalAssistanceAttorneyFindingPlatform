"use client";

import { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Plus, Send, Download, Mic, MicOff, MessageSquare } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface ChatResponse {
  answer: string;
  source_previews?: Array<{
    filename: string;
    chunk_id: number;
    text: string;
  }>;
  latency: number;
}

interface ChatMessage {
  query: string;
  response?: ChatResponse;
  isLoading?: boolean;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  title: string; // First query of the session or a default title
}

export default function Chat() {
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setQuery(transcript);
          if (event.results[0].isFinal) {
            handleSubmit(new Event("submit") as any);
          }
        };

        recognitionRef.current.onerror = (event) => {
          let errorMessage = `Speech recognition error: ${event.error}`;
          if (event.error === "not-allowed") {
            errorMessage = "Microphone access denied. Please allow microphone permissions in Chrome settings.";
          } else if (event.error === "no-speech") {
            errorMessage = "No speech detected. Please try speaking again.";
          } else if (event.error === "network") {
            errorMessage = "Network error. Please check your internet connection.";
          } else if (event.error === "aborted") {
            errorMessage = "Speech recognition aborted. Please try again.";
          }
          setError(errorMessage);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setError(
          "Speech recognition is not supported. Please ensure you're using Chrome on HTTPS or http://localhost. Check Chrome settings for microphone access."
        );
      }
    }
  }, []);

  // Load sessions from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessions = sessionStorage.getItem("chatSessions");
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
          setShowChat(true);
        }
      }
    }
  }, []);

  // Save sessions to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && sessions.length > 0) {
      sessionStorage.setItem("chatSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Create a new chat session
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      messages: [],
      title: "New Chat",
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setShowChat(false);
    setQuery("");
    setError(null);
  };

  // Switch to a different session
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowChat(true);
    setQuery("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim() || !currentSessionId) return;
    setLoading(true);
    setError(null);
    setShowChat(true);

    // Add query with loading state to current session
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, { query, isLoading: true }],
              title: session.messages.length === 0 ? query.slice(0, 30) : session.title,
            }
          : session
      )
    );

    try {
      const res = await axios.post<ChatResponse>(
        "/api/chatbot",
        { query },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Replace loading message with actual response
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: session.messages.map((msg, index) =>
                  index === session.messages.length - 1
                    ? { query, response: res.data, isLoading: false }
                    : msg
                ),
              }
            : session
        )
      );
      setQuery("");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Failed to get a response.");
      // Remove loading message on error
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: session.messages.filter((msg, index) => index !== session.messages.length - 1),
              }
            : session
        )
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [sessions, currentSessionId]);

  // Function to handle downloading a specific response
  const handleDownload = (message: ChatMessage) => {
    if (!message.response) return;
    let content = `Legal Chatbot Response\n\n`;
    content += `Query: ${message.query}\n\n`;
    content += `Answer: ${message.response.answer}\n\n`;

    if (message.response.source_previews && message.response.source_previews.length > 0) {
      content += `Sources:\n`;
      message.response.source_previews.forEach((source, index) => {
        content += `${index + 1}. ${source.filename}\n`;
      });
      content += `\n`;
    }

    content += `Latency: ${message.response.latency} seconds\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chatbot_response_${new Date().toISOString().replace(/[:.]/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError(
        "Speech recognition is not supported. Please use Chrome on HTTPS or http://localhost and ensure microphone permissions are enabled."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current!.start();
          setIsListening(true);
        })
        .catch((err) => {
          setError("Microphone access denied. Please enable microphone permissions in Chrome settings.");
          console.error(err);
          setIsListening(false);
        });
    }
  };

  // Get current session messages
  const currentSession = sessions.find((session) => session.id === currentSessionId);
  const chatHistory = currentSession ? currentSession.messages : [];

  return (
    <div className="min-h-screen bg-[#192432] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#263a56] p-4 flex flex-col border-r border-[#29374a]">
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center bg-[#4a5d78] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#5a6d88] transition-colors duration-200 mb-4"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center space-x-2 ${
                session.id === currentSessionId ? "bg-[#4a5d78]" : "bg-[#29374a] hover:bg-[#3a4b66]"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="truncate">{session.title}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!showChat && !currentSessionId ? (
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
                    className="w-full bg-transparent border border-[#29374a] rounded-full py-3 pl-12 pr-20 focus:outline-none focus:ring-1 focus:ring-[#4a5d78]"
                    disabled={loading || !currentSessionId}
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                    onClick={() => document.querySelector("input")?.focus()}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className={`absolute right-12 top-1/2 -translate-y-1/2 ${
                      isListening ? "text-red-400 animate-pulse" : "text-white/50 hover:text-white"
                    }`}
                    onClick={toggleVoiceInput}
                    disabled={loading || !currentSessionId}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    disabled={loading || !currentSessionId}
                  >
                    {loading ? "Loading..." : <Send className="w-5 h-5" />}
                  </button>
                </form>
                {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center pb-20">
              <div className="w-full max-w-3xl space-y-4">
                {chatHistory.map((message, index) => (
                  <div key={index} className="space-y-4">
                    <div className="p-3 rounded-lg bg-[#263a56] text-white">
                      <strong>You:</strong> {message.query}
                    </div>
                    <div className="p-4 rounded-lg bg-[#29374a] text-white">
                      {message.isLoading ? (
                        <div className="flex items-center space-x-1">
                          <span>Typing</span>
                          <span className="animate-pulse">...</span>
                        </div>
                      ) : (
                        <>
                          {message.response!.answer}
                          {message.response!.source_previews && message.response!.source_previews.length > 0 && (
                            <div className="mt-4">
                              <h3 className="text-sm font-semibold text-white/70">Sources:</h3>
                              <ul className="list-disc pl-5 text-sm">
                                {message.response!.source_previews.map((source, sourceIndex) => (
                                  <li key={sourceIndex}>
                                    <strong>{source.filename}</strong>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-sm text-white/70 mt-4">Latency: {message.response!.latency} seconds</p>
                          <button
                            onClick={() => handleDownload(message)}
                            className="mt-4 flex items-center justify-center bg-[#4a5d78] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#5a6d88] transition-colors duration-200 w-full sm:w-auto"
                            disabled={!message.response}
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download Response
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatContainerRef} />
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#192432] border-t border-[#263a56]">
              <div className="max-w-3xl mx-auto relative">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit(e)}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border border-[#29374a] rounded-full py-3 pl-4 pr-20 focus:outline-none focus:ring-1 focus:ring-[#4a5d78]"
                    disabled={loading || !currentSessionId}
                  />
                  <button
                    type="button"
                    className={`absolute right-12 top-1/2 -translate-y-1/2 ${
                      isListening ? "text-red-400 animate-pulse" : "text-white/50 hover:text-white"
                    }`}
                    onClick={toggleVoiceInput}
                    disabled={loading || !currentSessionId}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    disabled={loading || !currentSessionId}
                  >
                    {loading ? "Loading..." : <Send className="w-5 h-5" />}
                  </button>
                </form>
                {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}