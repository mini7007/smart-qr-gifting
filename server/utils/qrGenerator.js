const QRCode = require('qrcode');

const DEFAULT_OPTIONS = {
  width: 320,
  margin: 1,
  errorCorrectionLevel: 'M'
};

async function generateQrDataUrl(url) {
  return QRCode.toDataURL(url, DEFAULT_OPTIONS);
}

module.exports = {
  generateQrDataUrl
};
