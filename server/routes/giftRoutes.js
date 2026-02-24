const express = require('express');
const { createGift, getGift } = require('../controllers/giftController');
const { upload, validateUploadedFileSizes } = require('../utils/upload');

const router = express.Router();

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
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
  ]),
  validateUploadedFileSizes,
  asyncRoute(createGift)
);
router.get('/:publicId', asyncRoute(getGift));

module.exports = router;
