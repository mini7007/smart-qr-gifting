const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [300, 'Message must be 300 characters or less']
    },
    videoUrl: {
      type: String,
      default: ''
    },
    audioUrl: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    gifUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Gift', GiftSchema);
