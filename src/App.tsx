import React, { useState, useEffect } from "react";
import { 
  Sparkles, Plus, Image as ImageIcon, CheckCircle, 
  Trash2, Trophy, ArrowRight, MessageSquare, ListCheck, Home, 
  RefreshCw, Menu, X, ArrowUpRight, HelpCircle
} from "lucide-react";

import { Room, RoomAnalysis, ChatMessage } from "./types";
import { SAMPLE_ROOMS } from "./utils/roomTemplates";
import UploadArea from "./components/UploadArea";
import RoomAnalysisDashboard from "./components/RoomAnalysisDashboard";
import RoomChat from "./components/RoomChat";

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatGenerating, setIsChatGenerating] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>("");
  const [streakCount, setStreakCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Load rooms from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cluttercare_rooms_v1");
      const savedStreak = localStorage.getItem("cluttercare_streak_v1");
      
      if (savedStreak) {
        setStreakCount(parseInt(savedStreak, 10));
      }

      if (saved) {
        const parsed = JSON.parse(saved) as Room[];
        if (parsed && parsed.length > 0) {
          setRooms(parsed);
          setSelectedRoomId(parsed[0].id);
          return;
        }
      }
      
      // If empty layout, pre-populate with the first sample room (Messy Office) for intuitive onboarding!
      const defaultSample = SAMPLE_ROOMS[0];
      const starterRoom: Room = {
        id: "starter_office",
        name: defaultSample.name,
        image: defaultSample.dataUri,
        createdAt: new Date().toISOString(),
        analysis: defaultSample.defaultAnalysis as any,
        chatHistory: []
      };
      
      setRooms([starterRoom]);
      setSelectedRoomId(starterRoom.id);
      localStorage.setItem("cluttercare_rooms_v1", JSON.stringify([starterRoom]));
    } catch (e) {
      console.error("Failed to initialize state from localStorage:", e);
    }
  }, []);

  // Save current room list to localStorage on updates
  const saveRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    localStorage.setItem("cluttercare_rooms_v1", JSON.stringify(updatedRooms));
  };

  // Switch Rooms
  const handleSelectRoom = (id: string) => {
    setSelectedRoomId(id);
    setLoadError("");
    setSidebarOpen(false); // Close mobile sidebar on toggle
  };

  // Delete Room
  const handleDeleteRoom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = rooms.filter((r) => r.id !== id);
    if (filtered.length === 0) {
      // Keep state non-empty or reset
      localStorage.removeItem("cluttercare_rooms_v1");
      setRooms([]);
      setSelectedRoomId("");
    } else {
      saveRooms(filtered);
      if (selectedRoomId === id) {
        setSelectedRoomId(filtered[0].id);
      }
    }
  };

  // New room upload handler (handles both sandbox stock selection & real API custom photos)
  const handleRoomSelected = async (base64Data: string, name: string, category: string, preloadedAnalysis?: any) => {
    setLoadError("");
    
    // Check if this is a preloaded sandbox template
    if (preloadedAnalysis) {
      const newRoom: Room = {
        id: `room_${Date.now()}`,
        name: name,
        image: base64Data,
        createdAt: new Date().toISOString(),
        analysis: JSON.parse(JSON.stringify(preloadedAnalysis)), // deep clone
        chatHistory: []
      };

      const revised = [newRoom, ...rooms];
      saveRooms(revised);
      setSelectedRoomId(newRoom.id);
      return;
    }

    // Run actual server-side image understanding using gemini-3.1-pro-preview!
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Data,
          roomCategoryPreference: category
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze room photo.");
      }

      const parsedAnalysis = await response.json() as RoomAnalysis;

      const newRoom: Room = {
        id: `room_${Date.now()}`,
        name: name,
        image: base64Data,
        createdAt: new Date().toISOString(),
        analysis: parsedAnalysis,
        chatHistory: []
      };

      const revised = [newRoom, ...rooms];
      saveRooms(revised);
      setSelectedRoomId(newRoom.id);

    } catch (err: any) {
      console.error("Analysis Failure:", err);
      setLoadError(err.message || "Unable to contact the server. Please check your network or credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle tasks in the checklist (Updates streak and completes item status)
  const handleToggleChecklist = (itemId: string) => {
    const updated = rooms.map((room) => {
      if (room.id !== selectedRoomId || !room.analysis) return room;

      const revisedChecklist = room.analysis.checklist.map((task) => {
        if (task.id !== itemId) return task;
        
        const nextState = !task.completed;
        
        // Handle streak increment for completions
        if (nextState) {
          const newStreak = streakCount + 1;
          setStreakCount(newStreak);
          localStorage.setItem("cluttercare_streak_v1", newStreak.toString());
        } else {
          const newStreak = Math.max(0, streakCount - 1);
          setStreakCount(newStreak);
          localStorage.setItem("cluttercare_streak_v1", newStreak.toString());
        }

        return { ...task, completed: nextState };
      });

      return {
        ...room,
        analysis: {
          ...room.analysis,
          checklist: revisedChecklist
        }
      };
    });

    saveRooms(updated);
  };

  // Multi-turn chat handler
  const handleSendMessage = async (text: string, modelName: string) => {
    const activeRoom = rooms.find((r) => r.id === selectedRoomId);
    if (!activeRoom || isChatGenerating) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      parts: [{ text }],
      timestamp: new Date().toISOString()
    };

    // Update history locally first
    const updatedChatHistory = [...activeRoom.chatHistory, userMsg];
    const temporaryRooms = rooms.map((r) => {
      if (r.id === selectedRoomId) {
        return { ...r, chatHistory: updatedChatHistory };
      }
      return r;
    });
    setRooms(temporaryRooms);
    setIsChatGenerating(true);

    try {
      // Query full-stack chatbot with history and image reference!
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: activeRoom.chatHistory, // includes prior turns
          modelName: modelName,
          roomImage: activeRoom.image, // Marie has spatial awareness!
          targetCategory: activeRoom.analysis?.category || activeRoom.name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate response.");
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `msg_model_${Date.now()}`,
        role: "model",
        parts: [{ text: data.reply }],
        timestamp: new Date().toISOString()
      };

      const finalRooms = rooms.map((r) => {
        if (r.id === selectedRoomId) {
          return { ...r, chatHistory: [...updatedChatHistory, modelMsg] };
        }
        return r;
      });

      saveRooms(finalRooms);

    } catch (err: any) {
      console.error("Chat Error:", err);
      const errModelMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: "model",
        parts: [{ text: `Oops! I couldn't process that query: ${err.message}. Please verify your network or Try again.` }],
        timestamp: new Date().toISOString()
      };
      
      const revertedRooms = rooms.map((r) => {
        if (r.id === selectedRoomId) {
          return { ...r, chatHistory: [...updatedChatHistory, errModelMsg] };
        }
        return r;
      });
      setRooms(revertedRooms);
    } finally {
      setIsChatGenerating(false);
    }
  };

  const activeRoom = rooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col" id="app-root">
      {/* 1. APP TOP GLIDE BAR */}
      <header className="bg-white border-b border-slate-100 px-4 py-4 sm:px-6 sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 lg:hidden cursor-pointer"
              title="Toggle sidebar menu"
            >
              {sidebarOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
            
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5.5 h-5.5" />
            </div>

            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 leading-tight">
                Declutter AI
                <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold uppercase shrink-0">
                  Dual-Pro
                </span>
              </h1>
              <span className="hidden sm:inline text-xs text-slate-400 mt-0.5 font-medium">
                Spatially Aware Organizing Assistant powered by Gemini 3.1 Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div 
              className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 px-3 py-1.5 rounded-full shadow-xs"
              title="Your motivation points for checking off organizing actions!"
            >
              <Trophy className="w-4 h-4 text-amber-600 animate-bounce" />
              <div className="text-right">
                <span className="block text-[9px] uppercase font-mono font-bold leading-none text-slate-500">Streak Score</span>
                <span className="text-xs font-black text-amber-800 leading-none">{streakCount} pts</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
              <span>Sandboxed Node Host</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT DECK */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6 items-stretch relative min-h-0">
        
        {/* SIDEBAR: NAVIGATION DECK */}
        <aside 
          className={`lg:w-72 shrink-0 bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-4 lg:p-0 border border-slate-100 lg:border-none shadow-lg lg:shadow-none min-h-0 flex flex-col gap-4 fixed lg:static inset-y-16 left-4 z-30 transition-all duration-300 w-80 ${
            sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
          }`}
          id="sidebar-deck"
        >
          {/* Quick upload trigger */}
          <button
            onClick={() => handleSelectRoom("")}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedRoomId === ""
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
                : "bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            Audit New Room Space
          </button>

          {/* Room Directory List */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4.5 flex-1 flex flex-col shadow-xs overflow-hidden min-h-[300px]">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-widest block mb-3 font-bold">
              Your Rooms ({rooms.length})
            </span>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] lg:max-h-none pr-1">
              {rooms.map((room) => {
                const isSelected = room.id === selectedRoomId;
                const total = room.analysis?.checklist.length || 0;
                const done = room.analysis?.checklist.filter((t) => t.completed).length || 0;

                return (
                  <button
                    key={room.id}
                    onClick={() => handleSelectRoom(room.id)}
                    className={`w-full p-3 rounded-xl transition-all cursor-pointer border text-left flex items-center gap-3 group relative ${
                      isSelected
                        ? "bg-indigo-50/50 border-indigo-100"
                        : "bg-white hover:bg-slate-50/40 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {/* Visual box indicator */}
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner relative">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold truncate leading-snug ${isSelected ? "text-indigo-950" : "text-slate-700"}`}>
                        {room.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {room.analysis ? `Progress: ${done}/${total}` : "Awaiting analysis..."}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleDeleteRoom(room.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete this room workspace"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </button>
                );
              })}

              {rooms.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <ImageIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">No rooms processed yet.</p>
                  <p className="text-[10px] text-slate-300 mt-1">Upload an image to get started.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-50 mt-4 text-[10px] text-slate-400 leading-relaxed font-medium">
              💡 <span className="font-bold underline">Tip:</span> Re-auditing with direct, clear lighting yields optimal precision.
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs z-20 lg:hidden"
          ></div>
        )}

        {/* WORKSTAGE VIEWPORT */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">

          {/* A. NOTIFICATION WARNING BOXES */}
          {loadError && (
            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
              <span className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                ⚠️
              </span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold tracking-tight">Image Analysis Blocked</h4>
                <p className="text-xs text-rose-700 leading-relaxed">{loadError}</p>
                <button
                  onClick={() => setLoadError("")}
                  className="text-xs font-bold text-rose-800 underline block mt-2 hover:text-rose-900"
                >
                  Clear error notification
                </button>
              </div>
            </div>
          )}

          {/* B. DETECTOR PANEL AND SELECTION */}
          {selectedRoomId === "" ? (
            <div className="space-y-6">
              {/* Introduction Callout */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="max-w-xl space-y-4 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-teal-300 bg-teal-950/80 border border-teal-800/80">
                    ✨ Marie-Kondo Spatially Programmed
                  </span>
                  
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight md:leading-none">
                    Reclaim Your Living Spaces
                  </h2>
                  
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Upload an image or tap one of our ready-to-test layouts. Marie will instantly label trouble spots, generate structured checklist directories, and assist you in real-time chat with direct spatial understanding.
                  </p>
                </div>
              </div>

              {/* Central Upload Dashboard */}
              {isLoading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-md flex flex-col items-center justify-center min-h-[380px] space-y-5 animate-pulse">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-indigo-600 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Marie is reviewing your layout...</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                      Using image-understanding model <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-indigo-600">gemini-3.1-pro-preview</code> to classify item categories &amp; prioritize tidy tactics. Please wait a moment.
                    </p>
                  </div>
                </div>
              ) : (
                <UploadArea onPhotoSelected={handleRoomSelected} />
              )}
            </div>
          ) : (
            // ACTIVE SELECTED ROOM WORKSPACE
            activeRoom && (
              <div className="space-y-6" id="workspace-layout">
                {/* Visual Header Row */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4.5 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* Compact Image Sphere */}
                    <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-inner">
                      <img
                        src={activeRoom.image}
                        alt={activeRoom.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                          {activeRoom.name}
                        </h2>
                        {activeRoom.analysis && (
                          <span className="text-[10px] bg-indigo-50 border border-indigo-100 font-extrabold text-indigo-600 px-2 py-0.5 rounded-full capitalize">
                            {activeRoom.analysis.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        Audited on {new Date(activeRoom.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectRoom("")}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Audit Another Room
                    </button>
                  </div>
                </div>

                {/* Primary Content Split Pane: Dashboard vs. Chatbot */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Analysis Report Panel */}
                  <div className="xl:col-span-7 space-y-6 order-2 xl:order-1">
                    {activeRoom.analysis ? (
                      <RoomAnalysisDashboard 
                        analysis={activeRoom.analysis} 
                        onToggleChecklist={handleToggleChecklist}
                      />
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                        <ListCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-slate-700">No room analysis parameters loaded.</h4>
                        <p className="text-xs text-slate-400 mt-1">Please delete and upload this room photo container again.</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: AI Assistant Chat */}
                  <div className="xl:col-span-5 order-1 xl:order-2 sticky top-24">
                    <RoomChat 
                      room={activeRoom} 
                      onSendMessage={handleSendMessage}
                      isGenerating={isChatGenerating}
                    />
                  </div>

                </div>
              </div>
            )
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-slate-400 text-[11px] font-mono tracking-wider shrink-0">
        <p className="uppercase">DECLUTTER AI ASSISTANT PANEL • COURSE PORTFOLIO EDITION</p>
        <p className="text-slate-300 mt-1">NO PRIVATE CODES OR KEYS STORED ON RENDER CONTEXTS</p>
      </footer>
    </div>
  );
}
