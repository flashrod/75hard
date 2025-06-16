const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  profileInfo: {
    age: Number,
    height: String,
    weight: String,
    fitnessGoal: String
  },
  currentChallengeDay: {
    type: Number,
    default: 0
  },
  challengeStartDate: {
    type: Date,
    default: null
  },
  challengeStatus: {
    type: String,
    enum: ['not_started', 'active', 'completed', 'failed'],
    default: 'not_started'
  },
  totalResets: {
    type: Number,
    default: 0
  },
  completedChallenges: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  return user;
};

module.exports = mongoose.model('User', userSchema);
// This model defines the structure of the User document in MongoDB.
// It includes fields for Firebase UID, name, email, profile information, challenge tracking, and timestamps.