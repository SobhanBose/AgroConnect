import React, { useState, useRef, useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import { useUser } from "../context/context";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";

const KEY = import.meta.env.VITE_API_KEY;
const hf = new HfInference(KEY);

const AIAddProduct = () => {
  const [json, setJson] = useState({});
  const [isProduceExist, setIsProduceExist] = useState(false);
  const [produceID, setProduceID] = useState();
  const [timer, setTimer] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const { user } = useUser();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const timerInterval = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Hi ${user.role === "farmer" ? "Farmer" : "Consumer"}! I can help you add products or harvests. Provide me following informations: name, description, image url, tag, harvest date, quantity harvested and rate per unit of the product.`,
    },
  ]);

  const SYSTEM_PROMPT =
    user.role === "farmer"
      ? "You are AgroBot, a friendly assistant for farmers. If the farmer asks to add products, always respond with only a valid JSON object with the following structure: {'name': string, 'description': string, 'image_path': string, 'tag': string, 'harvest_date': string, 'qty_harvested': int, 'rate': int}. The date must be of format 'yyyy-mm-dd'. The valid tags are Vegetable, Fruit, Organic, Diary. After the JSON, respond with the word 'validate' to confirm the structure. Do not include any additional words or explanations before the JSON. If the input is not related to adding products, respond with general agricultural advice or FAQs, but still follow the same structure of first returning the JSON if applicable."
      : "You are AgroBot, a helpful assistant for consumers on AgroConnect. Answer basic questions about the app and fresh produce. Do not assist with advanced features like ordering or tracking.";

  const ifProduceExistAPI = `https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/produce/search`;
  const addProduceAPI = `https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/produce/add`;
  const addHarvestAPI = `https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/harvest/add`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => console.log("🎙️ Listening started");
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onerror = (event) => console.error("❌ Speech error:", event.error);
      recognition.onend = () => {
        setListening(false);
        clearInterval(timerInterval.current);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech Recognition is not supported in your browser.");
    }
  }, []);

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.start();
    setListening(true);
    listeningRef.current = true;
    setTimer(0);
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    listeningRef.current = false;
    clearInterval(timerInterval.current);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const validateAndParseJson = async (response) => {
    try {
      const match = response.match(/\{[\s\S]*?\}[\s]*validate/);
      if (match) {
        let jsonString = match[0].replace(/\s*validate$/, "").trim();
        jsonString = jsonString.replace(/\\(?!["\\/bfnrtu])/g, "");
        const jsonObject = JSON.parse(jsonString);
        const requiredFields = [
          "name",
          "description",
          "image_path",
          "tag",
          "harvest_date",
          "qty_harvested",
          "rate",
        ];
        const isValid = requiredFields.every((field) => field in jsonObject);
        if (isValid) {
          jsonObject.name = jsonObject.name.charAt(0).toUpperCase() + jsonObject.name.slice(1);
          setJson(jsonObject);
          return true;
        }
      }
    } catch (error) {
      console.error("❌ Error parsing JSON:", error);
    }
    return false;
  };

  const checkIfProduceExists = async (name) => {
    try {
      const response = await fetch(`${ifProduceExistAPI}?produce_name=${name}`);
      const data = await response.json();
      if (response.ok && data.id) {
        setIsProduceExist(true);
        setProduceID(data.id);
      } else {
        setIsProduceExist(false);
      }
    } catch (error) {
      setIsProduceExist(false);
      console.error("Error checking produce:", error);
    }
  };

  const addProduce = async () => {
    const response = await fetch(addProduceAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: json.name,
        description: json.description,
        image_path: json.image_path,
        tag: json.tag,
      }),
    });
    if (!response.ok) throw new Error("Failed to add produce.");
    const data = await response.json();
    setProduceID(data.id);
  };

  const addHarvest = async () => {
    const response = await fetch(addHarvestAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produce_id: produceID,
        qty_harvested: json.qty_harvested,
        harvest_date: json.harvest_date,
        rate: json.rate,
      }),
    });
    if (!response.ok) throw new Error("Failed to add harvest.");
    await response.json();
  };

  const handleAddProduct = async (prompt) => {
    const MAX_RETRIES = 3;
    let attempt = 0;
    let success = false;

    while (attempt < MAX_RETRIES && !success) {
      try {
        console.log(`🔄 Attempt ${attempt + 1}`);
        setMessages((prev) => [...prev, { sender: "ai", text: `⏳ Processing... (Attempt ${attempt + 1})` }]);

        const response = await hf.chatCompletion({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          max_tokens: 200,
        });

        const aiReply = response?.choices?.[0]?.message?.content || "";
        const isValid = await validateAndParseJson(aiReply);
        delay(2000);

        if (!isValid) throw new Error("Invalid JSON");

        await checkIfProduceExists(json.name);
        await delay(2000);
        if (!isProduceExist) {
          await addProduce();
          await delay(2000);
        }
        await addHarvest();

        setMessages((prev) => [...prev, { sender: "ai", text: "✅ Product Added Successfully!" }]);
        success = true;

      } catch (error) {
        console.error(`❌ Error on attempt ${attempt + 1}:`, error);
        attempt++;

        if (attempt >= MAX_RETRIES) {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "⚠️ Failed after multiple attempts. Please try again later." },
          ]);
        } else {
          await delay(2000);
        }
      }
    }
  };

  const sendMessage = async (prompt) => {
    if (!prompt.trim() || loading) return;

    const newUserMessage = { sender: "user", text: prompt };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      await handleAddProduct(prompt);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  return (
    <div className="mt-16 mb-16 ml-20 fixed inset-0 bg-white flex flex-col shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 font-semibold text-lg shadow-md">
        {user.role === "farmer" ? "Farmer" : "Consumer"} ChatBot – AgroBot
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                msg.sender === "user" ? "bg-green-100 text-right" : "bg-white border text-left"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          {listening ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <span>🎙 {timer}s</span>
              <button onClick={stopListening} className="ml-1 text-xs text-red-600 hover:underline">
                Stop
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700"
              >
                <FaPaperPlane />
              </button>
              <button
                onClick={startListening}
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700"
              >
                <FaMicrophone />
              </button>
            </>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ask your question..."
          />
        </div>
      </div>
    </div>
  );
};

export default AIAddProduct;
