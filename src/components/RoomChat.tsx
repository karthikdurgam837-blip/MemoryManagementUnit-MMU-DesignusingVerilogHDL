import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Sparkles, User, HelpCircle, ArrowRight } from "lucide-react";
import { ChatMessage, Room } from "../types";

interface RoomChatProps {
  room: Room;
  onSendMessage: (text: string, model: string) => Promise<void>;
  isGenerating: boolean;
}

export default function RoomChat({ room, onSendMessage, isGenerating }: RoomChatProps) {
  const [inputText, setInputText] = useState("");
  const [modelType, setModelType] = useState<"lite" | "flash" | "pro">("flash");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [room.chatHistory, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    const text = inputText;
    setInputText("");
    onSendMessage(text, modelType);
  };

  const handleQuickQuestion = (q: string) => {
    if (isGenerating) return;
    onSendMessage(q, modelType);
  };

  const starterPrompts = [
    "Where is the best place to start sorting this room?",
    "How can I manage cables or wires visible here?",
    "Can you suggest a system to store hobbies and small toys?"
  ];

  const modelLabels = {
    lite: "Breeze (Flash-Lite)",
    flash: "Balanced (Gemini 3.5)",
    pro: "Specialist (Gemini Pro)"
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 flex flex-col h-[550px] shadow-sm overflow-hidden" id="chat-widget">
      {/* Thread Header with Model Selector */}
      <div className="bg-slate-900 px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-white border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 font-bold text-sm shadow-md">
            M
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 leading-tight">
              Chat with Marie
            </h3>
            <p className="text-[10px] text-teal-400 font-mono tracking-wider flex items-center gap-1 mt-0.5">
              <span>●</span> SPECIALIZED DE-CLUTTER ORGANISER
            </p>
          </div>
        </div>

        {/* Model Selector dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="model-select" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden sm:block">
            AI Engine:
          </label>
          <select
            id="model-select"
            value={modelType}
            onChange={(e) => setModelType(e.target.value as any)}
            className="bg-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-700 hover:border-slate-600 cursor-pointer text-white"
          >
            <option value="lite">{modelLabels.lite}</option>
            <option value="flash">{modelLabels.flash}</option>
            <option value="pro">{modelLabels.pro}</option>
          </select>
        </div>
      </div>

      {/* Message Area Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
        {/* Welcome message if timeline is empty */}
        {room.chatHistory.length === 0 && (
          <div className="space-y-4 text-center max-w-sm mx-auto my-6 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto border border-indigo-100 shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Has visual recognition of your room</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Marie has examined the photo of your <strong className="text-indigo-600">{room.name}</strong>. Ask specific layout queries, KonMari tips, or box suggestion strategies.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                SUGGESTED ENQUIRIES:
              </span>
              <div className="grid grid-cols-1 gap-2 text-left">
                {starterPrompts.map((prompt, ind) => (
                  <button
                    key={ind}
                    onClick={() => handleQuickQuestion(prompt)}
                    className="w-full text-xs bg-white hover:bg-slate-100 transition-all text-slate-700 px-3 py-2 rounded-xl border border-slate-200/80 hover:border-indigo-200 shadow-sm flex items-center gap-2 group cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-all shrink-0" />
                    <span className="truncate">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Existing Messages */}
        {room.chatHistory.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
              {/* Avatar on left */}
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  M
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                isUser
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-wrap"
              }`}>
                {msg.parts?.[0]?.text || ""}
                <span className={`block text-[9px] mt-1.5 font-medium ${
                  isUser ? "text-indigo-200 text-right" : "text-slate-400 text-left"
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Avatar on right */}
              {isUser && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Loader */}
        {isGenerating && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 animate-bounce">
              M
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              <span>Marie is mapping suggestions...</span>
            </div>
          </div>
        )}

        {/* Anchor point to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isGenerating ? "Marie is thinking..." : "Ask Marie a specific question about your room..."}
          disabled={isGenerating}
          className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border-0 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            inputText.trim() && !isGenerating
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow"
              : "bg-slate-100 text-slate-300 pointer-events-none"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
