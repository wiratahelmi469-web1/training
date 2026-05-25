# MindMate AI — Emotional Support Companion for University Students

MindMate AI is a warm, empathetic, and premium mental wellness companion designed specifically for university students. It targets issues like academic stress, final deadlines, exam anxiety, imposter syndrome, and burnout using a calming visual design and powerful Gemini AI integrations.

---

## 🎨 Design System

- **Primary Motif**: Soft Minimalist (Notion, Headspace, Apple Health style).
- **Colors**:
  - **Background**: `#F5F4EF` (Warm calm cream)
  - **Primary Soft Green**: `#A8B59A` (Calming slate herbal green)
  - **Accent Peach**: `#E8C7B7` (Soft comforting peach)
  - **Border**: `#D9D6CE` (Lighter warm grey)
  - **Text Primary**: `#2B2B2B` (Chic charcoal brown)
  - **Text Secondary**: `#6E6E6E` (Soft slate grey)
- **Typography**: Inter (UI / copy body) & Plus Jakarta Sans (Headers / display headings).

---

## 🛠️ Main Features

1. **AI Chat Companion (Bilingual support)**: Warm counselor utilizing Cognitive Behavioral Therapy (CBT) conversational patterns.
2. **Breathing Tool**: Dual animated breathing exercise selectors (Box Breathing 4-4-4 and Sleep Relaxing 4-7-8) with custom timers.
3. **Pikiran CBT (Reframe Tool)**: Rewires negative thoughts, turning limiting beliefs into hopeful perspectives.
4. **Pengurai Tugas (Task Breaker)**: Transforms overwhelming exam projects or assignments into bite-sized actionable microtasks.
5. **Journal Emosi**: Log daily emotional tags. State gratitude triggers. View historic timeline logs.
6. **Laporan Stress Mingguan**: Interactive pure-SVG custom stress indicator charts paired with dynamic AI analysis.
7. **Emergency Modal & Unit Darurat**: Advanced crisis pre-screening triggers an emergency modal referencing crisis line (*Into The Light Indonesia - 119 Ext. 8*) immediately when dangerous keywords are typed.

---

## 📂 Project Structure

```txt
/app
  ├── api/gemini/route.ts    # AI Server Side Router Gateway
  ├── globals.css            # Custom Google Fonts loading & Calm CSS variables
  ├── layout.tsx             # AuthProvider state wrapper
  ├── page.tsx               # Beautiful minimalist hero landing page
  ├── login/page.tsx         # Responsive login panel
  ├── register/page.tsx      # Responsive register sheet
  ├── onboarding/page.tsx    # Academic stressors & baseline stress level slider
  ├── dashboard/page.tsx     # Grand central workspace (All responsive views)
  └── crisis-support/page.tsx# Direct emergency helpline unit
/lib
  ├── context.tsx            # Context and states (Authentication & API integrations)
  └── db.ts                  # Local Storage persistent schemas
/prisma
  └── schema.prisma          # PostgreSQL production database design
```

---

## 🚀 Installation & Local Run

1. **Clone project and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** (Create a `.env` in root):
   ```env
   # Gemini API Credentials Config
   GEMINI_API_KEY="YOUR_OFFICIAL_GEMINI_API_KEY_HERE"
   
   # PostgreSQL database server path (for Prisma / Production)
   DATABASE_URL="postgresql://user:password@localhost:5432/mindmate_db?schema=public"
   ```

3. **Deploy database migrations (Prisma)**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with MindMate AI.

---

## 🌍 Production Deployment Guide

### Vercel (Frontend)
- Connect repository.
- Under project settings, define **GEMINI_API_KEY** and **DATABASE_URL** environment variables.
- Trigger deployment.

### Railway or Supabase (PostgreSQL Database)
- Spin up a new PostgreSQL database on Supabase or Railway.
- Retrieve the connection string.
- Provide connection URI as **DATABASE_URL** inside Vercel properties to run serverless Prisma queries.

---

## 🔒 Security & Privacy

All university student entries are designed with extreme privacy in mind. Chat streams are handled completely server-side via Next.js API Routes ensuring your API keys are private. The database utilizes sandbox encryption so academic groups or university administrators have zero access to private emotions.
