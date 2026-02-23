const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema({
  message: String,
  videoUrl: String
});

module.exports = mongoose.model('Gift', GiftSchema);
