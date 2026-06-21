# Declutter AI: Advanced Multimodal Spatial Organization Platform

A state-of-the-art full-stack spatial engineering and computer vision-enabled decluttering application. This platform utilizes multimodal model architectures to categorize, route, and organize residential and commercial clutter. Users upload spatial imagery to receive real-time, context-aware architectural recommendations, dynamic interactive checklist directories, and direct conversational access to an expert digital layout stylist.

---

## 🏢 1. Executive Summary

Living and commercial spaces directly affect human cognitive performance, anxiety levels, and operational throughput. Despite this, spatial maintenance often suffers from high mental friction, lack of clear categorization, and the emotional toll of deciding how to split and scale belongings.

**Declutter AI** bridges this gap by merging premium UX/UI visual patterns with a high-fidelity full-stack artificial intelligence engine. Rather than outputting speculative ungrounded text advice, the platform performs pixel-level layout evaluations of custom user-uploaded rooms. It dynamically generates comprehensive hierarchical checklists categorized by Marie Kondo action styles (*Keep*, *Donate*, *Discard*, *Relocate*), suggests physical storage and organizer apparatus, and provides a continuous conversational coaching companion. Through lightweight, gamified progress-tracking mechanisms, it reduces the friction of tidying, turning overwhelming rooms into actionable step-by-step sorting plans.

---

## ⚠️ 2. Problem Statement

Modern domestic and workspace organization is bottlenecked by three distinct architectural or cognitive challenges:

1. **Analysis Paralysis & Cognitive Overload**: An untidy room presents a highly complex visual layout. Users entering a disorganized space struggle to identify a baseline starting point, resulting in task avoidance and emotional fatigue.
2. **Lack of Tactical Action Segregation**: Standard tidying solutions fail to distinguish between diverse disposal routes. Belongings must be correctly categorized as reusable items (relocate/keep), zero-value wastes (discard), or community resources (donate). Without structural segregation, sorting cycles stall.
3. **Absence of Real-Time Adaptive Feedback**: Standard physical books or static guides cannot look at the user's room to provide localized solutions or suggest budget hardware (bins, shelves, grids) specific to the visible table legs or wall orientations.

---

## 🎯 3. Objectives

- **Visual Spatial Reasoning**: Implement real-time, secure multimodal imagery ingestion to analyze spatial constraints and isolate hotspots.
- **Micro-Action Orchestration**: Extract an actionable, prioritized sub-task directory enabling fine-grained control over the restoration process.
- **Marie Kondo Persona Pairing**: Provide a conversational chatbot interface utilizing dual-model configurations (balanced speed and analytical precision) that reference the visual room context dynamically.
- **Immediate Sandboxing Friction Reduction**: Offer immediate virtual room instances (e.g., Messy Office, Closet Explosion, Family Room) so users can test interactive dashboard elements without undergoing friction-heavy photo uploads.
- **Enterprise-Grade Privacy and Delivery**: Maintain strict secret containment: processing all API payloads behind an Express proxy server layer to ensure zero client-side key leakage.

---

## 📊 4. Market Research & Competitor Landscape

Digital household and inventory management is an emerging sector driven by the intersection of smart home technologies and environmental awareness.

| Competitor | Strengths | Major Weaknesses | **Declutter AI Advantage** |
| :--- | :--- | :--- | :--- |
| **Sortly** | Strong business inventory tracking, barcode scanner interface. | High manual entry friction; no intelligent layout analysis. | **Zero Manual Setup**: Extracts objects and groups directly from images. |
| **Clutter / Storage Apps** | Physical pickup logistics, clear pricing maps. | Locked to regional storage unit partners; no DIY tools. | **Empowers Immediate Action**: Focuses on immediate localized organizing. |
| **IKEA Space Planner** | Beautiful 3D models and precise dimensional measurements. | Extremely high setup learning curve; requires manually building walls. | **Photo-to-Strategy**: Instant automatic layout strategy from a simple snap. |

---

## 🛠️ 5. Technical Stack

To achieve scalable performance and fluid user interactions, the platform implements a modernized, full-stack client-server architecture:

- **Frontend Core**: React 19 (Single-Page Application) with absolute Type-Safe contracts.
- **Visual Design**: Tailwind CSS V4 utilizing atomic custom utilities and variable typography tokens.
- **Icons & Motion Graphics**: Lucide-React and responsive CSS core transforms.
- **Backend Service Layer**: Express Node.js Server hosting high-capacity API routes.
- **Target AI Engines**: Advanced Multi-Turn Conversational Models:
  - `gemini-3.1-pro-preview` for high-complexity, structured spatial analysis.
  - `gemini-3.5-flash` for high-throughput, balanced, natural conversational turns.
  - `gemini-3.1-flash-lite` for lightning-fast answers to minor inquiries.
- **Local Cache & Persistence**: Browser client storage (`localStorage`) for offline session persistence and motivation metrics.
- **Server Bundling & Distribution**: Esbuild and Tsx compilation pipeline.

---

## 📐 6. System Architecture & Workflow

The platform maintains a strict separation of concerns, routing raw visual payload transitions securely through a custom Express proxy:

```
[User Browser Client]
  │
  ├── 1. Drags & Drops Image Buffer or selects Sandbox Stock
  ├── 2. Dispatches payload with user-defined Category Context
  │
  ▼
[Express Server Proxy]
  │
  ├── A. Sanitizes Base64 headers & checks safety constraints
  ├── B. Inject internal Environment variables (Secret API keys)
  ├── C. Delegates payload to target Multimodal AI Engine
  │
  ▼
[Multimodal Model Service]  ── (Parses layout, matches assets, enforces structured JSON contracts)
  │
  ▼
[Express Server Proxy]
  │
  ├── D. Synthesizes and sanitizes JSON payload response
  ├── E. Dispatches reports back to Client
  │
  ▼
[Interactive Dashboard UI]  ── (Renders Custom Checklists, Strategies, and triggers Multi-Turn AI Conversation)
```

### Addressing Address Format & Location
All spatial, categorization, and chat queries are mapped directly to corresponding database matrices. Location fields within the checklist identify visual geographic zones in the photo (e.g., `Floor-L`, `Desk-R`), ensuring spatial alignment.

---

## 📂 7. Folder Structure

```
declutter-ai/
├── dist/                   # Compiled server-side commonJS distribution bundle
├── reports/                # Synthesis and static code metrics reports
├── src/
│   ├── components/         # Modular React views
│   │   ├── RoomAnalysisDashboard.tsx  # Dynamic metrics, progress gauges, and categorised lists
│   │   ├── RoomChat.tsx              # Multipurpose, multi-model AI chatbot widget
│   │   └── UploadArea.tsx            # Drag-and-drop file ingestion and Sandbox select grid
│   ├── utils/
│   │   └── roomTemplates.ts          # Illustrative messy room SVG mock data URIs
│   ├── types.ts            # Absolute global types and type contract definitions
│   ├── App.tsx             # Central route coordinator and state engine
│   ├── index.css           # Global Tailwind V4 styles and standard typography import
│   └── main.tsx            # Inception-level React DOM mount
├── index.html              # Static entry container
├── package.json            # Deployment package descriptors
├── tsconfig.json           # Type definitions compiler specifications
└── vite.config.ts          # Build bundle orchestration overrides
```

---

## 💾 8. Database Schema Recommendation

For larger-scale multi-user production deployments, we recommend mapping state models to a relational PostgreSQL database or enterprise Firestore layout:

### Entity Relationship Diagram (ERD)

```
┌─────────────────┐             ┌─────────────────────────┐
│     USER        │             │          ROOM           │
├─────────────────┤             ├─────────────────────────┤
│ id (PK)         │1           *│ id (PK)                 │
│ email           ├────────────►│ user_id (FK)            │
│ created_at      │             │ name                    │
│ current_streak  │             │ image_base64_url        │
└─────────────────┘             │ clutter_score           │
                                │ assessment_text         │
                                │ created_at              │
                                └───────┬─────────┬───────┘
                                        │1        │1
                                        │         │
                                        │*        │*
                        ┌───────────────▼─┐     ┌─▼───────────────────────┐
                        │ CHECKLIST_ITEM  │     │  REORG_STRATEGY         │
                        ├─────────────────┤     ├─────────────────────────┤
                        │ id (PK)         │     │ id (PK)                 │
                        │ room_id (FK)    │     │ room_id (FK)            │
                        │ item_description│     │ zone_label              │
                        │ priority_rank   │     │ proposal_text           │
                        │ zone_geographic │     │ products_suggested (Arr)│
                        │ category_group  │     └─────────────────────────┘
                        │ completed (Bool)│
                        └─────────────────┘
```

---

## 🔒 9. Security & Privacy Considerations

1. **Proxy Protection Pattern**: The application strictly avoids client-side network calls to Google's Gen AI endpoints. This hides API keys entirely from inspection in browser DevTools.
2. **Data Scrubbing**: Images are managed as transient base64 memory streams. In production, we recommend deploying an image sanitization filter (e.g., face blurring and geodata meta-stripping) before analysis.
3. **Generative Guardrails**: System prompts define strict thematic boundaries for our digital advisor Marie (restricting conversation flow to spatial organization, recycling, interior layout advice, and spatial wellness questions).

---

## 🧪 10. Testing Strategy

We guarantee codebase performance and translation consistency through three testing vectors:

- **Linter Enforcement**: Running strict TypeScript compilation tests before build packaging (`tsc --noEmit`) to certify absolute structural type safety.
- **Deterministic Prompt Verifications**: Simulating high-variance photo inputs to ensure system responses remain fully compliant with the target JSON structural schema.
- **Responsive Sandbox Integration**: Running automatic cross-browser checks on the interactive templates so users can immediately manipulate elements.

---

## 🚀 11. Deployment Plan

### Container Packaging (Docker)

To deploy this client-server application to distributed cloud runtimes (e.g., Google Cloud Run, AWS ECS, or DigitalOcean App Platform):

```dockerfile
# Build phase
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Standalone execution phase
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]
```

---

## 🔮 12. Future Enhancements

- **Real-Time AR Overlays**: Implement camera viewport feeds inside the WebApp to draw spatial placement guides directly over the physical walls.
- **E-Commerce Affiliate Integrations**: Stream suggestion nodes to local storage retailers (e.g., Contain Store, IKEA, Amazon) to let users click and buy recommended layout boxes instantly.
- **Multilingual Support**: Translate organizational advice into secondary local languages for broader community impact.
- **Deep Object Detection Integration**: Employ high-frequency bounding box maps to overlay green and red outline zones directly on the messy areas of the user's photos.
