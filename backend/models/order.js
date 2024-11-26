const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{ 
    name: String, 
    quantity: Number, 
    price: Number,
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    }
  }],
  totalAmount: Number,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'paid', 'cancelled'],
    default: 'pending' 
  },
  paymentMethod: {
    type: String,
    enum: ['jvcoin', 'card', 'cash'],
    default: 'jvcoin'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Order', orderSchema);