import React, { useState } from "react";
import { 
  Trophy, Trash2, Heart, RefreshCw, Layers, CheckSquare, 
  MapPin, ShieldAlert, Sparkles, Check, Square, Star, HelpCircle
} from "lucide-react";
import { RoomAnalysis, ChecklistItem, ActionCategory, Priority } from "../types";

interface RoomAnalysisDashboardProps {
  analysis: RoomAnalysis;
  onToggleChecklist: (itemId: string) => void;
}

export default function RoomAnalysisDashboard({ analysis, onToggleChecklist }: RoomAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActionCategory | "all">("all");
  const [sortByPriority, setSortByPriority] = useState(false);

  const { clutterScore, category, assessment, areasOfConcern, checklist, strategies, maintenanceRoutine } = analysis;

  // Calculators
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Clutter scale colors & labels
  const getClutterConfig = (score: number) => {
    if (score <= 3) {
      return {
        color: "text-emerald-500 bg-emerald-50 border-emerald-100",
        ringColor: "stroke-emerald-500",
        bgRing: "stroke-emerald-100",
        label: "Low Clutter (Optimistic Space)",
        darkColor: "text-emerald-400 bg-emerald-950/40",
        desc: "Immense potential for modular accents and highly functional layout patterns."
      };
    } else if (score <= 6) {
      return {
        color: "text-amber-500 bg-amber-50 border-amber-100",
        ringColor: "stroke-amber-500",
        bgRing: "stroke-amber-100",
        label: "Moderate Clutter (Needs Sorting)",
        darkColor: "text-amber-400 bg-amber-950/40",
        desc: "Sufficient room for movement but suffers from key object pile-ups and overlapping zones."
      };
    } else {
      return {
        color: "text-rose-500 bg-rose-50 border-rose-100",
        ringColor: "stroke-rose-500",
        bgRing: "stroke-rose-100",
        label: "High Clutter (Overloaded Flow)",
        darkColor: "text-rose-400 bg-rose-950/40",
        desc: "Requires a systematic Kondo sweep. Spatial navigation is highly obstructed."
      };
    }
  };

  const clutterConfig = getClutterConfig(clutterScore);

  const categoryIcons: Record<ActionCategory, React.ReactNode> = {
    keep: <Star className="w-3.5 h-3.5" />,
    donate: <Heart className="w-3.5 h-3.5" />,
    discard: <Trash2 className="w-3.5 h-3.5" />,
    relocate: <Layers className="w-3.5 h-3.5 text-blue-500" />
  };

  const categoryLabels: Record<ActionCategory, string> = {
    keep: "Keep / Organise",
    donate: "Donate / Gift",
    discard: "Recycle / Bin",
    relocate: "Relocate Zone"
  };

  // Filter & Sort checklists
  let filteredChecklist = activeTab === "all" 
    ? checklist 
    : checklist.filter((item) => item.category === activeTab);

  if (sortByPriority) {
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    filteredChecklist = [...filteredChecklist].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    });
  } else {
    // Sort completed to the bottom by default
    filteredChecklist = [...filteredChecklist].sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* 1. TOP METRICS SECTION (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Radial Guage Clutter Score */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center text-center relative shadow-sm min-h-[250px]">
          <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-slate-400">
            CLUTTER EVALUATION
          </div>

          <div className="relative w-32 h-32 flex items-center justify-center mt-3">
            {/* SVG circle */}
            <svg className="w-full h-full rotate-[-90deg]">
              <circle
                cx="64"
                cy="64"
                r="52"
                className={`fill-none stroke-[10] ${clutterConfig.bgRing}`}
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                className={`fill-none stroke-[10] ${clutterConfig.ringColor} transition-all duration-1000 ease-out`}
                strokeDasharray={326.7}
                strokeDashoffset={326.7 - (326.7 * clutterScore) / 10}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{clutterScore}</span>
              <span className="text-xl text-slate-400 font-bold">/10</span>
            </div>
          </div>

          <div className="mt-4">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${clutterConfig.color} border`}>
              {clutterConfig.label}
            </span>
          </div>
        </div>

        {/* Professional Assessment */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-indigo-600 block">
              EXPERTISE ROOM AUDIT
            </span>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              Marie&apos;s Spatial Assessment
            </h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
              &ldquo;{assessment}&rdquo;
            </p>
            <p className="text-xs text-slate-400">
              {clutterConfig.desc}
            </p>
          </div>

          {/* Quick habit tip card */}
          {maintenanceRoutine.length > 0 && (
            <div className={`mt-4 p-3.5 rounded-xl border border-dashed text-xs flex items-start gap-2.5 ${clutterConfig.color}`}>
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Marie&apos;s Maintenance Rule:</strong> {maintenanceRoutine[0]}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. AREAS OF CONCERN CARD */}
      {areasOfConcern.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-slate-300 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              High Impact Clutter Hotspots
            </h4>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {areasOfConcern.map((area, index) => (
              <li 
                key={index} 
                className="bg-slate-800/50 rounded-xl p-3 border border-slate-800/80 text-xs font-medium text-slate-300 leading-snug flex items-start gap-2"
              >
                <span className="inline-flex w-5 h-5 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-[10px] font-mono font-bold text-rose-400 shrink-0">
                  0{index + 1}
                </span>
                <span>{area}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 3. INTERACTIVE PROGRESSIVE CHECKLIST SECTION */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6" id="checklist-card">
        {/* Checklist Header */}
        <div className="sm:flex sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-4 border-b border-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              Sieve-and-Sort Action Checklist
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Work item-by-item to clear your space. Toggling items updates your streak and room progression.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Progress: {completedTasks}/{totalTasks} ({progressPercent}%)
            </span>
            <div className="w-24 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            {progressPercent === 100 && totalTasks > 0 && (
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
                <Trophy className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs & Preferences */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Items
            </button>
            {(["keep", "donate", "discard", "relocate"] as ActionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === cat 
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="shrink-0">{categoryIcons[cat]}</span>
                <span className="hidden sm:inline capitalize">{cat}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sortByPriority}
                onChange={() => setSortByPriority(!sortByPriority)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
              />
              Prioritise Actions
            </label>
          </div>
        </div>

        {/* Checklist item list container */}
        <div className="grid grid-cols-1 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
          {filteredChecklist.length > 0 ? (
            filteredChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className={`group flex items-start gap-3.5 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                  item.completed
                    ? "bg-slate-50/50 border-slate-100 opacity-60"
                    : "bg-white border-slate-200/70 hover:border-indigo-200 hover:bg-slate-50/40"
                }`}
              >
                {/* Custom Styled Checkbox toggle */}
                <button
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                    item.completed
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-300 bg-white text-transparent group-hover:border-indigo-400 group-hover:text-slate-100"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                {/* Text and context */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-relaxed ${
                    item.completed ? "line-through text-slate-400 font-normal" : "text-slate-800"
                  }`}>
                    {item.item}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <MapPin className="w-2.5 h-2.5" />
                      {item.zone}
                    </span>

                    <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-md tracking-wider ${
                      item.priority === 'High' 
                        ? 'text-rose-600 bg-rose-50 border border-rose-100'
                        : item.priority === 'Medium'
                          ? 'text-amber-600 bg-amber-50 border border-amber-100'
                          : 'text-indigo-600 bg-indigo-50 border border-indigo-100'
                    }`}>
                      {item.priority} priority
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {categoryIcons[item.category]}
                      {categoryLabels[item.category]}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50/40 rounded-xl border border-dashed border-slate-200">
              <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold">No tasks found matching this group.</p>
              <p className="text-[10px] text-slate-400 mt-1">Excellent work sorting your household belongings!</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. REORGANIZATION STRATEGIES */}
      {strategies.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Marie&apos;s Design &amp; Storage Strategies
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strat, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-indigo-600 font-bold">
                    Zone: {strat.zone}
                  </span>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                    {strat.proposal}
                  </p>
                </div>

                {/* Organizer suggestions */}
                {strat.productsSuggested && strat.productsSuggested.length > 0 && (
                  <div className="pt-3 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1.5">
                      SUGGESTED ORGANISERS:
                    </span>
                    <ul className="space-y-1.5">
                      {strat.productsSuggested.map((prod, pidx) => (
                        <li key={pidx} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{prod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HABIT ROUTINES */}
      {maintenanceRoutine.length > 1 && (
        <div className="bg-gradient-to-r from-indigo-50 to-teal-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest block">
              Continuous Maintenance Plan
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {maintenanceRoutine.map((routine, idx) => {
              const [title, rule] = routine.split(":") as [string, string | undefined];
              return (
                <div key={idx} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/60">
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 mb-1">
                    <Star className="w-3.5 h-3.5 fill-indigo-200 text-indigo-600 shrink-0" />
                    <span>{title || `Routine ${idx + 1}`}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rule ? rule.trim() : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
