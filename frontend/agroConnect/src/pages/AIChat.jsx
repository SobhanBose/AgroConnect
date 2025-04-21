import React, { useState, useRef, useEffect } from "react";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(import.meta.env.VITE_HF_API_KEY);

const AIChat = ({ role = "farmer" }) => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Hi ${role === "farmer" ? "Farmer" : "Consumer"}! I’m AgroBot. Ask me any general questions you have.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const MAX_MESSAGES = 3;

  const SYSTEM_PROMPT =
    role === "farmer"
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

    if (messageCount >= MAX_MESSAGES) {
      setMessages([
        ...updatedMessages,
        {
          sender: "ai",
          text: "⚠️ You've reached your daily message limit. Please come back tomorrow.",
        },
      ]);
      setLoading(false);
      return;
    }

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
      setMessageCount((count) => count + 1);
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
    <div className="mt-16 mb-16 fixed inset-0 bg-white flex flex-col z-50">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 font-semibold text-lg shadow-md">
        {role === "farmer" ? "Farmer" : "Consumer"} ChatBot – AgroBot
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

      {/* Input Box + Chat Remaining */}
      <div className="border-t bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading || messageCount >= MAX_MESSAGES}
            className="flex-1 border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={
              messageCount >= MAX_MESSAGES ? "Limit reached." : "Ask your question..."
            }
          />
          <button
            onClick={handleSend}
            disabled={loading || messageCount >= MAX_MESSAGES}
            className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* Chat Remaining Info */}
        <div className="text-xs text-gray-500 text-center mt-1 pr-1">
          {MAX_MESSAGES - messageCount} chats remaining today
        </div>
      </div>
    </div>
  );
};

export default AIChat;