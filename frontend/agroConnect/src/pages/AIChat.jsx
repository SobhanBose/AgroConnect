import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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

  const systemPrompt =
    role === "farmer"
      ? `You are AgroBot, a helpful chatbot for farmers using the AgroConnect platform. Answer basic questions clearly and politely. Do not assist with product listing, tracking, or advanced features.`
      : `You are AgroBot, a friendly chatbot for consumers on AgroConnect. Answer only simple, general questions. Don't respond to advanced feature-related queries.`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    const newUserMessage = { sender: "user", text: prompt };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    if (messageCount >= MAX_MESSAGES) {
      setMessages([
        ...updatedMessages,
        { sender: "ai", text: "⚠️ You've reached your daily message limit. Please come back tomorrow." },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiReply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setMessageCount((count) => count + 1);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Sorry, I couldn’t respond right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  return (
    <div className="mt-16 mb-16 fixed inset-0 bg-white flex flex-col">
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

      {/* Input box */}
      <div className="border-t bg-white px-3 py-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={
            messageCount >= MAX_MESSAGES ? "Limit reached." : "Ask your question..."
          }
          disabled={messageCount >= MAX_MESSAGES}
        />
        <button
          onClick={handleSend}
          disabled={loading || messageCount >= MAX_MESSAGES}
          className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AIChat;