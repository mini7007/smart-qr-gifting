const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Gift = require('../models/Gift');
const { generateQrDataUrl } = require('../utils/qrGenerator');

const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase() || '.mp4';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
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
        reject({ status: 400, message: 'Video must be 30MB or smaller.' });
        return;
      }

      reject({ status: 400, message: err.message || 'Upload failed.' });
    });
  });
}

function buildPublicBaseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
}

exports.createGift = async (req, res, next) => {
  try {
    await runUpload(req, res);

    const message = (req.body.message || '').trim();
    if (!message) {
      throw { status: 400, message: 'Message is required.' };
    }

    const gift = await Gift.create({
      message,
      videoUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const viewUrl = `${buildPublicBaseUrl(req)}/view.html?id=${gift._id}`;
    const qr = await generateQrDataUrl(viewUrl);

    res.status(201).json({
      id: gift._id,
      message: gift.message,
      videoUrl: gift.videoUrl,
      viewUrl,
      qr
    });
  } catch (error) {
    next(error);
  }
};

exports.getGift = async (req, res, next) => {
  try {
    const gift = await Gift.findById(req.params.id).lean();

    if (!gift) {
      res.status(404).json({ error: 'Gift not found.' });
      return;
    }

    res.json({
      id: gift._id,
      message: gift.message,
      videoUrl: gift.videoUrl,
      createdAt: gift.createdAt
    });
  } catch (error) {
    next({ status: 400, message: 'Invalid gift ID.' });
  }
};
