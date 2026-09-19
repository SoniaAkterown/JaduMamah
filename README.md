# JaduMamah — AI Social Media & LinkedIn Post Generator 🚀

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

**JaduMamah** is an AI-powered post generator and creator studio designed to help professionals, growth marketers, and digital creators craft viral, high-converting content for **LinkedIn**, **Facebook**, **Instagram**, and **YouTube**.

---

## 🌟 Key Highlights & Features

### 1. 🤖 AI-Powered Content Creation
- **Powered by Google Gemini 2.5 Flash**: Crafts engaging hooks, structured post bodies, and call-to-actions (CTAs) that maximize dwell time and engagement.
- **Custom Prompts & Tone Control**: Generate content for thought leadership, product launches, storytelling, case studies, or career milestones.
- **Instant AI Touch-Ups**: Polish tone, lengthen, shorten, insert appropriate emojis, or fix grammar with a single click.

### 2. 📱 Multi-Platform Social Sign-In & Profiles
- **LinkedIn**: Thought leadership, B2B growth, and career networking profile mode.
- **Facebook**: Optimized for page managers, groups, and community discussions.
- **Instagram**: Tailored for visual storytelling, carousel captions, and reels hooks.
- **YouTube**: Structured for community tab posts, video descriptions, and shorts scripts.
- **1-Click Switching**: Seamlessly switch between creator accounts directly in the UI.

### 3. ✍️ Full-Featured Editor Studio
- **Unicode Text Formatting**: Bold, italic, strikethrough, underline, and clean spacing compatible across all social platforms without breaking text.
- **Smart Metrics**: Real-time character count, word counter, sentence tally, and estimated reading time.
- **Pre-made Hooks & Snippets**: Quick inserts for opening hooks, engagement questions, bullet lists, and hashtag packs.

### 4. 👁️ Real-time Pixel-Perfect Preview
- **Desktop & Mobile Mockup**: Live feed preview matching LinkedIn's exact feed architecture.
- **Interactive "See More" Toggle**: Test your hook's cut-off point before publishing to maximize click-throughs.
- **Reactions & Engagement Bar**: Visual preview of likes, comments, and repost interactions.

### 5. 🌐 Complete Bilingual Experience (English & বাংলা)
- Native toggle between **English** and **বাংলা (Bangla)** across all labels, tools, placeholders, and error messages.

### 6. 💾 Drafts, Persistence & Exporting
- **Draft Management**: Save drafts locally or to your user profile to resume editing anytime.
- **1-Click Copy & Confetti**: Copy formatted text directly to your clipboard.
- **Direct LinkedIn Share**: Launch your post directly into LinkedIn with one click.
- **PDF Export**: Generate downloadable PDFs of your posts for archiving or carousel preparation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React Icons, Canvas Confetti |
| **Backend** | Express 4.x, TypeScript with `tsx`, Node.js |
| **AI Engine** | Google Gemini API (`@google/genai` with `gemini-2.5-flash`) |
| **PDF Generation** | `jspdf`, `pdf-lib` |
| **Build & Bundle** | Vite (Client SPA) + ESBuild (Server Bundle) |

---

## 📁 Project Directory Structure

```
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Modular UI Components
│   │   ├── AIPostEditorStudio.tsx   # Central editor and live preview studio
│   │   ├── AuthModal.tsx            # Multi-platform sign-in & registration modal
│   │   ├── FooterHeroSection.tsx    # Promotional hero banner & footer links
│   │   ├── MoreFreeToolsSection.tsx # Suite of complementary free tools
│   │   ├── Navbar.tsx               # Top navigation with auth & language controls
│   │   ├── PostPreview.tsx          # Real-time social preview component
│   │   └── SocialIcons.tsx          # SVG icons for LinkedIn, Facebook, IG & YouTube
│   ├── translations.ts     # Complete English & Bengali localization dictionary
│   ├── types.ts            # Shared TypeScript interfaces & types
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Global stylesheet with Tailwind CSS v4
│   └── main.tsx            # Application DOM entry point
├── server.ts               # Express API proxy (Gemini AI, Auth, Posts storage)
├── metadata.json           # Application platform configuration
├── package.json            # Node dependencies and build scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A Google Gemini API Key 

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/jadu-mamah.git
   cd jadu-mamah
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 📡 API Overview

The Express backend (`server.ts`) provides clean, secured REST endpoints:

### Authentication (`/api/auth/*`)
- `POST /api/auth/social` — Fast 1-click social sign-in for LinkedIn, Facebook, Instagram, and YouTube.
- `POST /api/auth/login` — Standard email and password login.
- `POST /api/auth/register` — Creator account registration with custom platform and headline.
- `GET /api/auth/me` — Verify session and retrieve current creator profile.

### AI Generation & Touch-Up
- `POST /api/generate` — Generates viral post variations based on topic, tone, target audience, and length.
- `POST /api/touchup` — Applies targeted AI improvements (tone polish, emoji insertion, length adjustments).

### Post Management & Storage
- `GET /api/posts` — Retrieve user's saved drafts and generated post history.
- `POST /api/posts` — Save a newly written or edited post draft.
- `DELETE /api/posts/:id` — Delete a saved post.

---

## 🌍 Localization (i18n)

The application provides out-of-the-box support for:
- **English (`en`)**
- **বাংলা (`bn`)**

All copy, helper hints, platform options, and free tools dynamically switch language instantly without page reloads.

---


## 📄 License

This project is licensed under the [ Apache-2.0 License](LICENSE).
