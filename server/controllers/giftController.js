const Gift = require('../models/Gift');
const { generateQrDataUrl } = require('../utils/qrGenerator');

function buildPublicBaseUrl(req) {
  return process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `${req.protocol}://${req.get('host')}`;
}

async function createGift(req, res) {
  try {
    console.log('[gift] body:', req.body);

    const videoFile = req.files?.video?.[0] || null;
    const audioFile = req.files?.audio?.[0] || null;

    console.log('[gift] video:', !!videoFile);
    console.log('[gift] audio:', !!audioFile);

    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const mediaFile = videoFile || audioFile;
    const videoUrl = mediaFile ? `/uploads/${mediaFile.filename}` : null;

    const gift = new Gift({
      message,
      videoUrl
    });

    await gift.save();

    const viewUrl = `${buildPublicBaseUrl(req)}/gift/${gift._id}`;
    const qr = await generateQrDataUrl(viewUrl);

    return res.status(200).json({
      success: true,
      qr,
      viewUrl
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
