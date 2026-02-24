const mongoose = require('mongoose');
const Gift = require('../models/Gift');
const { generateQrDataUrl } = require('../utils/qrGenerator');
const { generateGiftToken } = require('../utils/giftToken');

function buildPublicBaseUrl(req) {
  return process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `${req.protocol}://${req.get('host')}`;
}

async function createUniqueGiftToken() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const token = generateGiftToken();
    // eslint-disable-next-line no-await-in-loop
    const exists = await Gift.exists({ publicId: token });
    if (!exists) {
      return token;
    }
  }

  throw new Error('Failed to generate a unique gift token.');
}

function buildGiftLookupQuery(identifier) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return {
      $or: [{ publicId: identifier }, { _id: identifier }]
    };
  }

  return { publicId: identifier };
}

async function createGift(req, res) {
  try {
    console.log('[gift] body:', req.body);

    const videoFile = req.files?.video?.[0] || null;
    const audioFile = req.files?.audio?.[0] || null;
    const imageFile = req.files?.image?.[0] || null;
    const gifFile = req.files?.gif?.[0] || null;

    console.log('[gift] media:', {
      video: !!videoFile,
      audio: !!audioFile,
      image: !!imageFile,
      gif: !!gifFile
    });

    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const rawTheme = typeof req.body.theme === 'string' ? req.body.theme.trim().toLowerCase() : 'default';
    const theme = ['default', 'birthday', 'love', 'festival', 'romantic', 'corporate'].includes(rawTheme)
      ? rawTheme
      : 'default';

    const gift = new Gift({
      publicId: await createUniqueGiftToken(),
      message,
      videoUrl: videoFile ? `/uploads/${videoFile.filename}` : '',
      audioUrl: audioFile ? `/uploads/${audioFile.filename}` : '',
      imageUrl: imageFile ? `/uploads/${imageFile.filename}` : '',
      gifUrl: gifFile ? `/uploads/${gifFile.filename}` : '',
      theme
    });

    await gift.save();

    const viewUrl = `${buildPublicBaseUrl(req)}/gift/${gift.publicId}`;
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
    const identifier = req.params.publicId;
    const gift = await Gift.findOne(buildGiftLookupQuery(identifier)).lean();

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found.' });
    }

    return res.json({
      id: gift.publicId || gift._id,
      message: gift.message,
      videoUrl: gift.videoUrl,
      audioUrl: gift.audioUrl,
      imageUrl: gift.imageUrl,
      gifUrl: gift.gifUrl,
      createdAt: gift.createdAt,
      theme: gift.theme || 'default'
    });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unexpected server error';
    return res.status(500).json({ error: message });
  }
}

module.exports = {
  buildGiftLookupQuery,
  createGift,
  getGift
};
