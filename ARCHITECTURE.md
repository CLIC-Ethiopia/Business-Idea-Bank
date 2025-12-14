# System Architecture

## Overview

NeonVentures is a Single Page Application (SPA) built with React and TypeScript. It utilizes a "Serverless" architecture, relying on Google Gemini for compute/logic generation and Supabase for data persistence and authentication.

## 🏗 Directory Structure

```text
/
├── index.html          # Entry point, Tailwind CDN, Fonts
├── index.tsx           # React Root
├── App.tsx             # Main State Machine & Router
├── types.ts            # TypeScript Interfaces (Models)
├── constants.ts        # Static Data (Industries, Images)
├── locales.ts          # Internationalization (EN/AM)
├── components/         # UI & Feature Components
│   ├── NeonUI.tsx      # Core Design System (Cards, Buttons, Inputs)
│   ├── Dashboards.tsx  # User & Admin Views
│   ├── Community.tsx   # Social Feed Logic
│   ├── ChatWidget.tsx  # Floating AI Assistant
│   └── ...
└── services/           # External API Layers
    ├── geminiService.ts    # AI Generation Logic
    └── supabaseClient.ts   # Database & Auth Connection
```

## 🧠 State Management

The application uses a **finite state machine pattern** implemented via the `AppState` enum in `App.tsx`. This controls the main view hierarchy without the need for a complex routing library (like React Router), maintaining a "kiosk" or "terminal" feel.

**States:**
*   `LOGIN`: Auth Screen.
*   `SELECT_INDUSTRY`: Main "Home" screen.
*   `LOADING_*`: Interstitial loading states with animations.
*   `VIEW_CANVAS`: Detailed view of a business model.
*   `DASHBOARD`: User profile and saved items.
*   `COMMUNITY`: Social feed.

Global user state (`currentUser`) is lifted to `App.tsx` and propagated down via props.

## 🤖 AI Integration Strategy (`geminiService.ts`)

We use the `@google/genai` SDK with strict schema enforcement to ensure structured JSON outputs from the LLM.

1.  **Idea Generation**:
    *   **Model**: `gemini-2.5-flash` (High speed/throughput).
    *   **Prompting**: Uses strict JSON schema (`responseSchema`) to force the AI to return an array of `BusinessIdea` objects. This eliminates parsing errors.
    *   **Grounding**: We perform a secondary "Google Custom Search" (mocked or implemented via API) to fetch real machine images corresponding to the AI-generated machine names.

2.  **Chat Assistant (Prof. Fad)**:
    *   **Model**: `gemini-2.5-flash-lite` (Low latency).
    *   **Streaming**: Implemented via `sendMessageStream` to provide a typewriter effect.
    *   **Context Injection**: The chat widget injects the current `AppState`, `SelectedIndustry`, and `UserProfile` into the system prompt invisibly, allowing the AI to be context-aware.

## 💾 Data Persistence (`supbaseClient.ts`)

*   **Profiles**: Stores user demographics and preferences.
*   **Ideas**: Stores both system-generated (Admin) and user-saved ideas.
    *   *Note*: Ideas generated on-the-fly by AI are transient until the user clicks "Save", at which point they are persisted to Supabase.
*   **Local Storage**: Used as a fallback for "Guest" users to save Canvases and for caching PDF generation data.

## 🎨 UI/UX Design System

The `NeonUI.tsx` component library abstracts the Cyberpunk aesthetic.

*   **Tailwind Configuration**: Custom colors (`neon-blue`, `neon-pink`, `dark-bg`) and fonts (`Orbitron` for headers, `Rajdhani` for body).
*   **Visuals**: Extensive use of CSS `box-shadow` for glow effects, semi-transparent backgrounds with backdrops, and CSS animations (`fadeIn`, `pulse`, `spin`).

## 🔄 Data Flow Example: Generating an Idea

1.  **User Action**: Clicks "Scan Agriculture Sector".
2.  **State Change**: `AppState` -> `LOADING_IDEAS`.
3.  **Service Call**: `geminiService.generateIdeas('Agriculture')`.
4.  **AI Processing**: Gemini generates 6 JSON objects.
5.  **Image Enrichment**: Application fetches images for "Hydroponic System", "Tractor", etc.
6.  **State Change**: `AppState` -> `SELECT_IDEA` (Data populated).
7.  **User Action**: Click "Analyze".
8.  **Service Call**: `geminiService.generateCanvas(idea)`.
9.  **State Change**: `AppState` -> `VIEW_CANVAS`.
