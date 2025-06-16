const express = require('express');
const ProgressPhoto = require('../models/ProgressPhoto');
const ChallengeDay = require('../models/ChallengeDay');
const auth = require('../middleware/auth');
const { upload, cloudinary } = require('../utils/cloudinary');

const router = express.Router();

// @route   POST /api/upload/progress-photo
// @desc    Upload progress photo
// @access  Private
router.post('/progress-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { dayNumber, notes } = req.body;
    const userId = req.user.id;

    // Check if photo already exists for this day
    const existingPhoto = await ProgressPhoto.findOne({ userId, dayNumber });
    
    if (existingPhoto) {
      // Delete old photo from Cloudinary
      await cloudinary.uploader.destroy(existingPhoto.cloudinaryPublicId);
      
      // Update existing photo
      existingPhoto.imageUrl = req.file.path;
      existingPhoto.cloudinaryPublicId = req.file.filename;
      existingPhoto.notes = notes;
      existingPhoto.uploadDate = new Date();
      
      await existingPhoto.save();
      
      res.json({
        success: true,
        message: 'Progress photo updated successfully',
        photo: existingPhoto
      });
    } else {
      // Create new progress photo
      const newPhoto = new ProgressPhoto({
        userId,
        dayNumber: parseInt(dayNumber),
        imageUrl: req.file.path,
        cloudinaryPublicId: req.file.filename,
        notes
      });

      await newPhoto.save();

      // Update the corresponding challenge day
      await ChallengeDay.findOneAndUpdate(
        { userId, dayNumber: parseInt(dayNumber) },
        {
          'tasks.progressPhoto.completed': true,
          'tasks.progressPhoto.photoId': newPhoto._id
        }
      );

      res.status(201).json({
        success: true,
        message: 'Progress photo uploaded successfully',
        photo: newPhoto
      });
    }
  } catch (error) {
    console.error('Upload progress photo error:', error);
    
    // Clean up uploaded file if database operation fails
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    
    res.status(500).json({ message: 'Server error during photo upload' });
  }
});

// @route   GET /api/upload/progress-photos
// @desc    Get all progress photos for user
// @access  Private
router.get('/progress-photos', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await ProgressPhoto.find({ userId }).sort({ dayNumber: 1 });

    res.json({
      success: true,
      photos
    });
  } catch (error) {
    console.error('Get progress photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/upload/progress-photo/:photoId
// @desc    Delete progress photo
// @access  Private
router.delete('/progress-photo/:photoId', auth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    const photo = await ProgressPhoto.findOne({ _id: photoId, userId });
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.cloudinaryPublicId);

    // Update challenge day
    await ChallengeDay.findOneAndUpdate(
      { userId, dayNumber: photo.dayNumber },
      {
        'tasks.progressPhoto.completed': false,
        'tasks.progressPhoto.photoId': null
      }
    );

    // Delete from database
    await ProgressPhoto.findByIdAndDelete(photoId);

    res.json({
      success: true,
      message: 'Progress photo deleted successfully'
    });
  } catch (error) {
    console.error('Delete progress photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
