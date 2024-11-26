const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const POSMasterSchema = new mongoose.Schema({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Venue'
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
POSMasterSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

module.exports = mongoose.model('POSMaster', POSMasterSchema);
