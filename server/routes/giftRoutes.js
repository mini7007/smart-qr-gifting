const express = require('express');
const router = express.Router();
const { createGift, getGift } = require('../controllers/giftController');

router.post('/', createGift);
router.get('/:id', getGift);

module.exports = router;
