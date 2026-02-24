const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createGift, getGift } = require('../controllers/giftController');

const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }
});

const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch((error) => {
    const message = error && error.message ? error.message : 'Unexpected server error';
    res.status(500).json({ error: message });
  });
};

router.post(
  '/',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  asyncRoute(createGift)
);
router.get('/:id', asyncRoute(getGift));

module.exports = router;
