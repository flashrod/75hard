const mongoose = require('mongoose');

const progressPhotoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 75
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Ensure one photo per day per user
progressPhotoSchema.index({ userId: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model('ProgressPhoto', progressPhotoSchema);
