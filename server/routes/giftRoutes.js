const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { createGift, getGift } = require('../controllers/giftController');

const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch((error) => {
    const message = error && error.message ? error.message : 'Unexpected server error';
    res.status(500).json({ error: message });
  });
};

router.post('/', upload.single('video'), asyncRoute(createGift));
router.get('/:id', asyncRoute(getGift));

module.exports = router;
