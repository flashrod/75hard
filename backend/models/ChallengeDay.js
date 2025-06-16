const mongoose = require('mongoose');

const challengeDaySchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  tasks: {
    workout1: {
      completed: { type: Boolean, default: false },
      duration: { type: Number }, // in minutes
      type: { type: String }, // cardio, strength, etc.
      notes: { type: String }
    },
    workout2: {
      completed: { type: Boolean, default: false },
      duration: { type: Number },
      type: { type: String },
      notes: { type: String }
    },
    waterIntake: {
      completed: { type: Boolean, default: false },
      amount: { type: Number }, // in ounces
      notes: { type: String }
    },
    dietCompliance: {
      completed: { type: Boolean, default: false },
      dietType: { type: String },
      notes: { type: String }
    },
    reading: {
      completed: { type: Boolean, default: false },
      pages: { type: Number },
      bookTitle: { type: String },
      notes: { type: String }
    },
    progressPhoto: {
      completed: { type: Boolean, default: false },
      photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProgressPhoto' }
    }
  },
  allTasksCompleted: {
    type: Boolean,
    default: false
  },
  dayCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  generalNotes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Pre-save middleware to check if all tasks are completed
challengeDaySchema.pre('save', function(next) {
  const tasks = this.tasks;
  this.allTasksCompleted = 
    tasks.workout1.completed &&
    tasks.workout2.completed &&
    tasks.waterIntake.completed &&
    tasks.dietCompliance.completed &&
    tasks.reading.completed &&
    tasks.progressPhoto.completed;
  
  next();
});

module.exports = mongoose.model('ChallengeDay', challengeDaySchema);
