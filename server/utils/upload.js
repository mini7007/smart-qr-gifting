const path = require('path');
const multer = require('multer');

const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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

    cb(new Error('Unsupported file type. Please upload a video file.'));
  }
});

module.exports = upload;
