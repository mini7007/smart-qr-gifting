# Smart QR Gifting 🎁

Smart QR Gifting lets users create heartfelt digital gifts and share them with QR codes and private links.

## ✨ Core Features

- QR-based gift delivery
- Text + optional media uploads (video/audio/image/GIF)
- Secure public gift tokens
- PWA-ready frontend
- Multilingual-safe message handling

## ✨ Smart Message Enhancer (Free Mode)

Smart QR Gifting now includes a **free smart message enhancer** (no paid AI required).

- Works fully without paid AI APIs
- Preserves the user’s original language/script (multilingual safe)
- Applies light grammar cleanup, capitalization polish, and tasteful theme emojis
- Stores both `originalMessage` and `enhancedMessage` for modular evolution
- Uses a client-side preview mirror for low-latency UX (debounced)
- Architecture stays AI-ready for future upgrades
- Gift result page is future AR ready (`#ar-stage` placeholder)

## 🎨 Gift Themes

Theme-aware creation + viewing:

- **Birthday**
- **Love / Romantic**
- **Festival / Corporate**
- **Default surprise**

## 🖼️ Smart Media Pipeline

Upload page enhancements:

- Drag & drop + click upload support
- Visual drag highlight states
- Smart image compression via canvas before upload
- GIF size warning flow
- Video size validation

## 🏗️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Multer
- Vercel (frontend) + Railway (backend)

## 🚀 Environment Setup

Create `.env` in project root:

```bash
MONGODB_URI=mongodb://localhost:27017/smart-qr-gifting
PORT=5000
# Optional for deployment URL generation:
RAILWAY_PUBLIC_DOMAIN=your-app.up.railway.app
```

Install and run:

```bash
npm install
npm run dev
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

## 🚀 Future Roadmap

- Optional AI provider integrations (modular)
- WebAR gift surface placement
- Neural TTS integration
- Theme packs + seasonal animations
- Gift analytics + campaign templates
