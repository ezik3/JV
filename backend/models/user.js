const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // Base fields
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['owner', 'manager', 'staff', 'venue', 'admin', 'user'],
    default: 'user'
  },
  fullName: { type: String },
  phone: { type: String },

  // Profile fields (new)
  profilePicture: {
    type: String,
    default: ''
  },
  showUsername: { type: Boolean, default: true },
  isProfileComplete: { type: Boolean, default: false },
  bio: { type: String },
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    privateProfile: { type: Boolean, default: false },
    showLocation: { type: Boolean, default: true }
  },
  
  // User location (for finding nearby users/venues)
  currentLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  },
  
  // Gold post tracking
  lastGoldPostDate: { type: Date },

  // Authentication fields (existing)
  isTOTPEnabled: { type: Boolean, default: false },
  totpSecret: { type: String },
  faceEnabled: { type: Boolean, default: false },
  faceEmbedding: { type: [Number] },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationCode: String,
  isPhoneVerified: { type: Boolean, default: false },
  phoneVerificationCode: String,

  // Venue-specific fields (existing)
  venueName: { type: String },
  venueType: { type: String },
  address: { type: String },
  country: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  isVenueVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{ type: String }],
  businessEmail: { type: String },
  businessLicense: { type: String },

  // Operating hours (for venues)
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },

  // Analytics and stats
  totalVisits: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],

  // Staff management (for venues)
  staff: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    permissions: [String]
  }],

  wallet: {
    jvCoinBalance: { type: Number, default: 0 },
    nfts: [{
      tokenId: String,
      name: String,
      image: String,
      purchaseDate: Date
    }]
  },
  xrpAddress: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Add these fields to your schema if they don't exist
  username: String,
  showUsername: { type: Boolean, default: true },
  profilePic: String,
  isProfileComplete: { type: Boolean, default: false }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Password hashing middleware (existing)
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method (existing)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked (existing)
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// New methods for profile management
userSchema.methods.updateProfile = async function(profileData) {
  Object.assign(this, profileData);
  this.isProfileComplete = true;
  return this.save();
};

userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.showUsername ? this.username : undefined,
    profilePicture: this.profilePicture,
    bio: this.bio,
    socialLinks: this.preferences.privateProfile ? undefined : this.socialLinks,
    role: this.role,
    venueName: this.role === 'venue' ? this.venueName : undefined,
    verificationStatus: this.role === 'venue' ? this.verificationStatus : undefined
  };
};

// Virtual for full name (new)
userSchema.virtual('displayName').get(function() {
  return this.fullName || this.username;
});

module.exports = mongoose.model('User', userSchema);
