import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables for local development
dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limit for photo uploads (base64)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Initialize the shared GoogleGenAI client with correct headers
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Structured JSON schema for the room analysis
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    clutterScore: {
      type: Type.INTEGER,
      description: "An integer representing overall cluttered-ness from 1 (immaculate/minimalist) to 10 (extremely cluttered/disorganized)."
    },
    category: {
      type: Type.STRING,
      description: "Proposed name or type of the workspace/room, e.g. Living Room, Home Office, Kitchen, Bedroom, Kids Room, Closet."
    },
    assessment: {
      type: Type.STRING,
      description: "A highly professional, warm, encouraging high-level evaluation of the space, noting its design potential, primary challenges, and spatial flow."
    },
    areasOfConcern: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Identify 2-4 primary trouble spots or high-clutter clusters visible in the photo."
    },
    checklist: {
      type: Type.ARRAY,
      description: "A comprehensive listing of small actionable decluttering tasks. Include items with varied actions (keep/donate/discard/relocate) and priority levels (High/Medium/Low).",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A simple unique short identifier like 'task-1', 'task-2', etc." },
          item: { type: Type.STRING, description: "E.g., Assemble loose stray mail, clear plastic bottles from desk, sort shirts by color." },
          priority: { type: Type.STRING, description: "Priority level: 'High', 'Medium', or 'Low'" },
          zone: { type: Type.STRING, description: "Location zone in the photo, e.g., Bedside Table, Closet Shelf, Computer Desk, Floor Corner." },
          category: { type: Type.STRING, description: "Action type: 'keep', 'donate', 'discard', or 'relocate'" },
          completed: { type: Type.BOOLEAN, description: "Default must be false" }
        },
        required: ["id", "item", "priority", "zone", "category", "completed"]
      }
    },
    strategies: {
      type: Type.ARRAY,
      description: "In-depth storage and reorganization solutions that go beyond basic tidying.",
      items: {
        type: Type.OBJECT,
        properties: {
          zone: { type: Type.STRING, description: "Target zone, e.g., Under Desk vertical space, Upper Cabinet hooks." },
          proposal: { type: Type.STRING, description: "A strategic spatial sorting instruction, layout advice, or functional improvement." },
          productsSuggested: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggested budget organizers to maximize this area (e.g. stackable wire bins, pegboard with hooks). Max 3 items."
          }
        },
        required: ["zone", "proposal"]
      }
    },
    maintenanceRoutine: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 simple, high-impact routines (daily or weekly habit actions) to prevent re-cluttering."
    }
  },
  required: ["clutterScore", "category", "assessment", "areasOfConcern", "checklist", "strategies", "maintenanceRoutine"]
};

// 1. ROOM EYE ANALYZER ENDPOINT
app.post("/api/analyze-room", async (req, res) => {
  try {
    const { image, roomCategoryPreference } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided for room analysis" });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add it to your secrets panel." 
      });
    }

    // Prepare the image part. The source is a base64 string, we strip the prefix if it's dual format.
    let cleanBase64 = image;
    let mimeType = "image/jpeg";
    if (image.startsWith("data:")) {
      const parts = image.split(";base64,");
      if (parts.length === 2) {
        mimeType = parts[0].replace("data:", "");
        cleanBase64 = parts[1];
      }
    }

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Analyze this room photo ${roomCategoryPreference ? `which is a ${roomCategoryPreference}` : ""}. 
Assess the room's clutter levels, spatial utility, layout opportunities, and organization needs.
Provide a high-quality assessment, spot core areas of concern, generate a step-by-step action checklist (labeled keep, donate, discard, relocate, prioritized), suggest storage/reorganization strategies, and form a quick custom maintenance routine. Keep tone welcoming, encouraging, and highly practical.
You must return your response conforming exactly to the JSON schema.`,
    };

    // Analyze using the requested image-understanding model gemini-3.1-pro-preview
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from the Gemini analysis service.");
    }

    const data = JSON.parse(resultText.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Error analyzing room:", error);
    return res.status(500).json({ 
      error: error.message || "An error occurred during room image analysis." 
    });
  }
});

// 2. CHAT ASSISTANT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, modelName, roomImage, targetCategory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not configured." 
      });
    }

    // Determine target model
    // Default to gemini-3.5-flash for general chat as per instructions
    let selectedModel = "gemini-3.5-flash";
    if (modelName === "gemini-3.1-pro-preview" || modelName === "pro") {
      selectedModel = "gemini-3.1-pro-preview";
    } else if (modelName === "gemini-3.1-flash-lite" || modelName === "lite") {
      selectedModel = "gemini-3.1-flash-lite";
    }

    // Compile contents list for multi-turn conversational API
    const contents: any[] = [];

    // System instruction defining the specialized persona
    const systemInstruction = `You are "Marie", a world-class professional organization consultant, KonMari system specialist, and friendly interior stylist.
Your tone is incredibly clean, encouraging, energetic, helpful, tidy, and compassionate. You understand that clutter often stems from emotional baggage, and you guide the user step-by-step on how to reclaim their space gracefully, prioritizing joy and function.
You are assisting the user to declutter and organize a space ${targetCategory ? `specifically verified as a ${targetCategory}` : ""}.
If the user references objects or arrangements, look at their room photo context to mention spatial details precisely! Provide actionable, friendly wisdom and smart household storage Hacks.`;

    // If history is provided, parse and format it correctly
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.parts?.[0]?.text || msg.text || "" }]
        });
      });
    }

    // If roomImage is attached and this is the first turn or we want to keep it fresh,
    // inject the visual as reference at the top of history sequence so the AI doesn't lose sight
    if (roomImage && contents.length === 0) {
      let cleanBase64 = roomImage;
      let mimeType = "image/jpeg";
      if (roomImage.startsWith("data:")) {
        const parts = roomImage.split(";base64,");
        if (parts.length === 2) {
          mimeType = parts[0].replace("data:", "");
          cleanBase64 = parts[1];
        }
      }

      contents.push({
        role: "user",
        parts: [
          { text: "Here is the visual context of the room we are working on." },
          { inlineData: { data: cleanBase64, mimeType } }
        ]
      });

      contents.push({
        role: "model",
        parts: [{ text: `I see the room photo! It is a ${targetCategory || "space"}. I've got my organizer eyes ready! How can I assist you in decluttering or styling this specific area?` }]
      });
    }

    // Add user's latest query
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I was unable to formulate a response. Let me know if you would like me to try again!";
    return res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Error in organizer chat:", error);
    return res.status(500).json({ 
      error: error.message || "An error occurred during organizing chat response." 
    });
  }
});

// START VITE OR STATIC FILES SERVING depending on production build environment
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted for development");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from dist directory in production");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running cleanly on http://localhost:${PORT}`);
  });
}

bootstrap();
