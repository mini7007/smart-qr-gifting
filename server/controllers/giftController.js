const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Gift = require('../models/Gift');
const { generateQrDataUrl } = require('../utils/qrGenerator');

const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      ensureUploadsDir();
      cb(null, uploadsDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase() || '.mp4';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file) {
      cb(null, true);
      return;
    }

    if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error('Unsupported video format. Please upload MP4, WebM, OGG, or MOV.'));
  }
}).single('video');

function runUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (!err) {
        resolve();
        return;
      }

      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        reject(new Error('Video must be 30MB or smaller.'));
        return;
      }

      reject(new Error(err.message || 'Upload failed.'));
    });
  });
}

function buildPublicBaseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
}

async function createGift(req, res) {
  try {
    await runUpload(req, res);

    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      throw new Error('Message is required.');
    }

    const videoUrl = req.file && req.file.filename ? `/uploads/${req.file.filename}` : '';

    const gift = new Gift({
      message,
      videoUrl
    });

    await gift.save();

    const viewUrl = `${buildPublicBaseUrl(req)}/view.html?id=${gift._id}`;
    const qrCodeUrl = await generateQrDataUrl(viewUrl);

    return res.status(201).json({
      success: true,
      qrCodeUrl,
      giftId: gift._id.toString()
    });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unexpected server error';
    return res.status(500).json({ error: message });
  }
}

async function getGift(req, res) {
  try {
    const gift = await Gift.findById(req.params.id).lean();

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    return res.json({
      id: gift._id,
      message: gift.message,
      videoUrl: gift.videoUrl,
      createdAt: gift.createdAt
    });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unexpected server error';
    return res.status(500).json({ error: message });
  }
}

module.exports = {
  createGift,
  getGift
};
