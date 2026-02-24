const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

const ALLOWED_MIME_TYPES = {
  video: new Set(['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']),
  audio: new Set(['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/webm', 'audio/ogg', 'audio/wav']),
  image: new Set(['image/png', 'image/jpeg', 'image/webp']),
  gif: new Set(['image/gif'])
};

const MAX_FILE_SIZE_BY_FIELD = {
  video: 50 * 1024 * 1024,
  audio: 20 * 1024 * 1024,
  image: 10 * 1024 * 1024,
  gif: 15 * 1024 * 1024
};

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function sanitizeExtension(extension) {
  if (!extension) return '';
  return extension.toLowerCase().replace(/[^a-z0-9.]/g, '');
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniquePart = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const ext = sanitizeExtension(path.extname(file.originalname || ''));
    cb(null, `${uniquePart}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 4
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ALLOWED_MIME_TYPES[file.fieldname];

    if (!allowedTypes) {
      cb(new Error(`Unsupported field: ${file.fieldname}`));
      return;
    }

    if (allowedTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error(`Unsupported file type for ${file.fieldname}.`));
  }
});

function validateUploadedFileSizes(req, res, next) {
  const files = req.files || {};

  for (const [field, list] of Object.entries(files)) {
    const maxSize = MAX_FILE_SIZE_BY_FIELD[field];
    if (!maxSize) {
      continue;
    }

    const file = Array.isArray(list) ? list[0] : null;
    if (file && file.size > maxSize) {
      try {
        fs.unlinkSync(file.path);
      } catch (_error) {
        // ignore cleanup errors
      }
      return res.status(400).json({ error: `${field} exceeds allowed size limit.` });
    }
  }

  next();
}

module.exports = {
  upload,
  validateUploadedFileSizes
};
