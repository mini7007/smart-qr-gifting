# Smart QR Gifting 🎁

Smart QR Gifting lets users create heartfelt digital gifts and share them instantly with a QR code or secure link. Every gift includes a required message and optional media uploads (video, audio, image, or GIF), making it flexible for personal, event, and campaign use.

## ✨ Features

- QR-based gift delivery
- Text messages
- Video uploads
- Audio recordings/uploads
- Image uploads
- GIF uploads
- Encrypted gift links 🔐
- PWA ready
- Multilingual ready
- Voice features (preview)


## Supported media uploads

- Text message
- Video upload
- Voice recording
- Image upload
- GIF upload

Some formats may depend on backend configuration.


## 🔐 Security

The backend is designed with production safety in mind:

- **publicId tokenization:** each new gift gets a randomly generated public token (`crypto.randomBytes(24)`), so raw MongoDB `_id` values are not exposed in fresh links.
- **Non-guessable links:** gift URLs now use `/gift/:publicId`, reducing predictability and scraping risk.
- **Backward compatibility:** old links that still contain Mongo ObjectIds continue to resolve safely.
- **Safe uploads:** Multer validates MIME type by field (`video`, `audio`, `image`, `gif`) and enforces file limits.
- **Optional media:** all media fields are optional so users can send text-only gifts without errors.

## 🏗️ Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Multer
- QRCode
- Vercel (frontend hosting)
- Railway (backend hosting)

## 🚀 Local Setup

### 1) Clone and install

```bash
git clone <your-repo-url>
cd smart-qr-gifting
npm install
```

### 2) Configure environment

Create a `.env` file in the project root:

```bash
MONGODB_URI=mongodb://localhost:27017/smart-qr-gifting
PORT=5000
```

> `RAILWAY_PUBLIC_DOMAIN` is optional and only used to force public URL generation in hosted environments.

### 3) Run the app

```bash
npm start
```

Server defaults to `http://localhost:5000`.

### 4) Verify health

```bash
curl http://localhost:5000/api/health
```

## 📡 API

### `POST /api/gifts`
Create a gift and generate a QR code.

**Request:** `multipart/form-data`

- `message` (required)
- `video` (optional)
- `audio` (optional)
- `image` (optional)
- `gif` (optional)

**Success response (unchanged contract):**

```json
{
  "success": true,
  "qr": "data:image/png;base64,...",
  "viewUrl": "https://your-domain.com/gift/<publicId>"
}
```

### `GET /gift/:publicId`
Render the gift view page by secure public ID.

- Also supports old ObjectId URLs for legacy compatibility.

## 🧪 Supported Media

| Field  | Accepted MIME types                                      | Max size |
|--------|-----------------------------------------------------------|----------|
| video  | `video/mp4`, `video/webm`, `video/ogg`, `video/quicktime` | 50 MB    |
| audio  | `audio/mpeg`, `audio/mp3`, `audio/mp4`, `audio/webm`, `audio/ogg`, `audio/wav` | 20 MB    |
| image  | `image/png`, `image/jpeg`, `image/webp`                  | 10 MB    |
| gif    | `image/gif`                                               | 15 MB    |

All media fields are optional. Message text is still required.

## 🧭 Migration Notes

If you already have live gifts in MongoDB:

1. Deploy backend update.
2. New gifts will auto-generate `publicId`.
3. Old `/gift/<ObjectId>` links continue to work without data migration.
4. (Optional) Backfill `publicId` for existing records if you want all URLs to be tokenized.

## 🔮 Roadmap

- Neural TTS
- AR gifts
- Expiring links
- End-to-end encryption

---

Built for delightful gifting experiences with production-safe defaults.
