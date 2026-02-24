# Smart QR Gifting 🎁

Smart QR Gifting lets users create heartfelt digital gifts and share them with QR codes and private links.

# Preview Home page 
<img width="1913" height="883" alt="image" src="https://github.com/user-attachments/assets/dd88faab-25e4-412b-aad3-61de96be5dd6" />

# Creation Preview 
<img width="1898" height="970" alt="image" src="https://github.com/user-attachments/assets/84e8923b-ebbb-4dfe-833e-06b2e50bb646" />



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

## 🎨 Immersive Theme Engine

Phase B introduces a cinematic, theme-driven experience layer across homepage and gift reveal flows:

- **Theme-driven UX:** centralized visual tokens in `THEME_CONFIG` keep birthday, wedding, corporate, and surprise experiences consistent.
- **Scalable for AR:** spotlight composition is structured to support future Three.js/WebAR mounts with minimal refactor.
- **Performance-first animations:** transform/opacity-only motion with reduced-motion support keeps rendering smooth on mobile.
- **Emotional design approach:** each theme includes subtle micro-animations and mood-tuned gradients to deepen recipient impact.

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
