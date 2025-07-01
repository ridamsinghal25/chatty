# 🧠 Chatty — Your ChatGPT Clone in Next.js

Chatty is a modern, full-featured ChatGPT-like AI assistant built using **Next.js**, replicating core functionality of ChatGPT with a clean interface and advanced features.

---

## 🚀 Features

- **🆕 New Chat** — Start fresh conversations anytime.
- **💬 Message Editing** — Seamlessly edit and regenerate previous user messages.
- **🖼️ Image Support** — Send and display image attachments in conversations.
- **🧠 Long Context Handling** — Handles long conversation histories efficiently using a context window.
- **💾 Chat Persistence** — Messages are stored and restored per session/chat ID.
- **⚡ Streamed Responses** — AI replies stream in real-time just like ChatGPT.
- **🧩 Modular Codebase** — Clean and scalable architecture with reusable components and context providers.

---

## 📦 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: React + Tailwind CSS
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Clerk
- **Deployment**: Vercel

---

## 📁 Project Structure

```
chatty/
├── app/
│   ├── chat/[chatId]/                # Chat page
│   └── api/                 # API routes (chat, messages)
├── components/              # Reusable UI components (Chat Message, Textarea, etc.)
├── contexts/                # React Context (MessageContext, etc.)
├── lib/                     # Utility functions (fetchers, memory helpers)
├── models/                  # Mongoose schemas (Message, Chat)
├── utils/                   # Helper functions (convertToAIMessages, etc.)
├── public/                  # Static files (images, icons)
├── styles/                  # Global CSS / Tailwind config
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript config
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chatty.git
cd chatty
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and set the following environment variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# MongoDB
MONGO_URI=

# OpenAI
OPENAI_API_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Mem0
MEM0_API_KEY=
```

### 4. Run the App

```bash
npm run dev
# or
yarn dev
```

---
