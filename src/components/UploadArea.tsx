import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Sparkles, FolderOpen, ArrowRight } from "lucide-react";
import { SAMPLE_ROOMS, SampleTemplate } from "../utils/roomTemplates";

interface UploadAreaProps {
  onPhotoSelected: (base64Data: string, name: string, category: string, sampleData?: any) => void;
}

export default function UploadArea({ onPhotoSelected }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [category, setCategory] = useState("Home Office");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Home Office", "Bedroom Closet", "Living Room", "Kitchen", "Bedroom", "Bathroom", "Garage", "Pantry", "Other"];

  // File processing helper
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg("Image is too large. Please select an image under 12MB.");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const finalName = roomName.trim() || `${category} (${file.name.substring(0, 15)})`;
        onPhotoSelected(reader.result, finalName, category);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleLoadSample = (sample: SampleTemplate) => {
    onPhotoSelected(sample.dataUri, sample.name, sample.category, sample.defaultAnalysis);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="upload-panel">
      {/* Configuration & Custom Upload Dropzone */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600 animate-pulse" />
            Upload Your Room Photo
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Drag in a photo of a messy cabinet, kitchen counter, desk, or wardrobe. Our Gemini-powered system will analyze clutter areas and compile custom solutions.
          </p>
        </div>

        {/* Configurations fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="room-name" className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-1.5">
              Room Label / Name
            </label>
            <input
              id="room-name"
              type="text"
              placeholder="e.g. Master Bedroom Closet"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label htmlFor="room-cat" className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-1.5">
              Space / Environment Category
            </label>
            <select
              id="room-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[240px] transition-all overflow-hidden group ${
            isDragging
              ? "border-indigo-600 bg-indigo-50/50 scale-[0.98]"
              : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50"
          }`}
          id="dropzone-area"
        >
          {/* Subtle decoration elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-2xl -mr-16 -mt-16 opacity-30 group-hover:bg-indigo-200 group-hover:opacity-20 transition-all pointer-events-none"></div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all mb-4">
            <Upload className="w-7 h-7" />
          </div>

          <p className="text-sm font-semibold text-slate-700">
            Drag &amp; drop your room image, or <span className="text-indigo-600 hover:underline">browse files</span>
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            Supports PNG, JPEG, WEBP or HEIC (Max 12MB)
          </p>

          {errorMsg && (
            <div className="mt-3 text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Stock Sample Bento Rooms (Instant sandbox) */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-4 z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-teal-300 bg-teal-950 border border-teal-800/80 mb-3.5">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Instant Sandboxing
            </span>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Don&apos;t have a messy photo?
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Select one of our illustrative messy templates to instantly test the customized interactive checklists and Marie Kondo suggestions!
            </p>
          </div>

          <div className="space-y-3.5">
            {SAMPLE_ROOMS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className="w-full text-left bg-slate-800/40 hover:bg-slate-800/80 transition-all p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 flex items-center gap-4 group cursor-pointer"
              >
                {/* Embedded SVG thumbnail preview */}
                <div className="w-16 h-12 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
                  <img
                    src={sample.dataUri}
                    alt={sample.name}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-all"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {sample.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-400 tracking-wider">
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {sample.description}
                  </p>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-2 z-10 justify-between">
          <span>COGNITIVE SPACE CLEANER v1.0</span>
          <span>● ONLINE</span>
        </div>
      </div>
    </div>
  );
}
