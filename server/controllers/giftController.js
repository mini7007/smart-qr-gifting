const Gift = require('../models/Gift');
const { generateQrDataUrl } = require('../utils/qrGenerator');

function buildPublicBaseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
}

async function createGift(req, res) {
  try {
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const gift = new Gift({
      message,
      videoUrl
    });

    await gift.save();

    const viewUrl = `${buildPublicBaseUrl(req)}/view.html?id=${gift._id}`;
    const qrCodeUrl = await generateQrDataUrl(viewUrl);

    return res.status(200).json({
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
