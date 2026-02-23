const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const Gift = require('../models/Gift');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage }).single('video');

exports.createGift = (req, res) => {
  upload(req, res, async () => {
    const gift = await Gift.create({
      message: req.body.message,
      videoUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const qr = await QRCode.toDataURL(`http://localhost:3000/view.html?id=${gift._id}`);
    res.json({ qr });
  });
};

exports.getGift = async (req, res) => {
  const gift = await Gift.findById(req.params.id);
  res.json(gift);
};
