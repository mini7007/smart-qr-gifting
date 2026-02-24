const crypto = require('crypto');

function generateGiftToken() {
  return crypto.randomBytes(24).toString('hex');
}

module.exports = {
  generateGiftToken
};
