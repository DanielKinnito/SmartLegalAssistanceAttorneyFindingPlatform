"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, PenSquare, Plus, Send } from "lucide-react"
import Header from "@/components/Header"

export default function AIBot() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "bot"; content: string }[]>([])
  const [showChat, setShowChat] = useState(false)

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: message }])

    // Simulate bot response (in a real app, this would call an AI API)
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I'm your legal assistant. I can help answer questions about legal procedures, rights, and general legal information. However, please note that I don't provide legal advice that replaces consultation with a qualified attorney.",
        },
      ])
    }, 1000)

    setMessage("")
    setShowChat(true)
  }

  return (
    <div className="min-h-screen bg-[#192432] text-white flex">
      {/* Sidebar */}
      <div className="w-[190px] border-r border-[#263a56] flex flex-col">
        <div className="p-4">
          <button className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-md py-2 px-3 text-sm">
            <PenSquare className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="px-4 py-2">
          <h3 className="text-sm text-white/70 mb-2">Recent</h3>
          <div className="space-y-1">{/* This would be populated with recent chats in a real app */}</div>
        </div>

        <div className="mt-auto p-4">
          <button className="w-full flex items-center justify-center p-2 hover:bg-white/10 rounded-md">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
       <Header/>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!showChat ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold mb-8">What can I help you with?</h1>
              <div className="w-full max-w-2xl px-4">
                <div className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question"
                    className="w-full bg-transparent border border-[#29374a] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-[#4a5d78]"
                  />
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                    onClick={() => document.querySelector("input")?.focus()}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`mb-4 max-w-3xl ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.role === "user" ? "bg-[#263a56] text-white" : "bg-[#29374a] text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#263a56]">
                <div className="max-w-3xl mx-auto relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border border-[#29374a] rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-[#4a5d78]"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
