# Smart QR Gifting 🎁

Smart QR Gifting lets users create heartfelt digital gifts and share them with QR codes and private links.

## 🤖 Mini Panda AI Assistant

Mini Panda is a floating multilingual assistant available in the frontend UI.

- Glassmorphism mobile-first widget
- Suggestion chips + typing indicator
- Session limit notice (3 AI tries per session)
- AI chat support for gift wording and theme-aware ideas

## 🔐 Secure AI Proxy

All AI calls run through backend Express routes (never from frontend keys):

- `POST /api/ai/chat`
- `POST /api/ai/generate-message`
- `POST /api/ai/generate-image`

Security + operational safeguards:

- OpenAI key is only read from `process.env.OPENAI_API_KEY`
- Per-session request cap: **3 requests**
- 429 returned when the session limit is exceeded
- Structured error handling and logging

## 🌍 Multilingual Support

- User input supports UTF-8 text in all languages/scripts
- AI is prompted to respond in the user’s language
- No forced English output

## 🎨 Gift Themes

Theme-aware creation + viewing:

- **Birthday**: confetti-like visuals, reveal motion, floating particles
- **Love**: warm gradients and softer palette
- **Festival**: vibrant glow styling

## 🖼️ Smart Media Pipeline

Upload page enhancements:

- Drag & drop + click upload support
- Visual drag highlight states
- Smart image compression via canvas before upload
- GIF size warning flow
- Video size validation (no heavy client processing)

## ✨ Core Features

- QR-based gift delivery
- Text + optional media uploads (video/audio/image/GIF)
- Secure public gift tokens
- PWA-ready frontend

## 🏗️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Multer
- OpenAI Node SDK
- Vercel (frontend) + Railway (backend)

## 🚀 Environment Setup

Create `.env` in project root:

```bash
MONGODB_URI=mongodb://localhost:27017/smart-qr-gifting
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
# Optional for deployment URL generation:
RAILWAY_PUBLIC_DOMAIN=your-app.up.railway.app
```

Install and run:

```bash
npm install
npm start
```

Health check:

```bash
curl http://localhost:5000/api/health
```

## 📡 API Snapshot

### `POST /api/gifts`
Create gift with message and optional media.

### `GET /api/gifts/:publicId`
Fetch gift JSON payload.

### `GET /gift/:publicId`
Render gift page experience.

### `POST /api/ai/chat`
AI assistant chat response.

### `POST /api/ai/generate-message`
Refines partial message input (same language).

### `POST /api/ai/generate-image`
Generates themed image output (URL/base64 when available).

## 🚀 Future Roadmap

- Neural TTS integration
- AI voice personas
- Theme packs + seasonal animations
- Gift analytics + campaign templates
- Optional expiring gift links
