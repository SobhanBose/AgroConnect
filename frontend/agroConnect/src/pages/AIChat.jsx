import React, { useState, useRef, useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import { useUser } from "../context/context";

const KEY = import.meta.env.VITE_API_KEY
const hf = new HfInference(KEY);

const AIChat = ({ role = "farmer" }) => {
  const {user} = useUser();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Hi ${user.role === "farmer" ? "Farmer" : "Consumer"}! I’m AgroBot. Ask me any general questions you have.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const SYSTEM_PROMPT =
    user.role === "farmer"
      ? "You are AgroBot, a friendly assistant that answers basic agricultural questions for farmers. Do not perform product listings or track orders. Just help with general tips and advice."
      : "You are AgroBot, a helpful assistant for consumers on AgroConnect. Answer basic questions about the app and fresh produce. Do not assist with advanced features like ordering or tracking.";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (prompt) => {
    if (!prompt.trim() || loading) return;

    const newUserMessage = { sender: "user", text: prompt };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await hf.chatCompletion({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
      });

      const aiReply = response?.choices?.[0]?.message?.content || "⚠️ Sorry, no reply.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error("❌ HuggingFace Mistral error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="mt-16 mb-16 fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 font-semibold text-lg shadow-md">
        {user.role === "farmer" ? "Farmer" : "Consumer"} ChatBot – AgroBot
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                msg.sender === "user"
                  ? "bg-green-100 text-right"
                  : "bg-white border text-left"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="border-t bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ask your question..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
