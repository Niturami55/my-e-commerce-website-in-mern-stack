const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 }
});

const shippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingSchema,
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay', 'UPI', 'Card'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Placed'
  },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  deliveredAt: Date,
  trackingId: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Generate order number
orderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    this.orderNumber = 'SS' + Date.now() + Math.floor(Math.random() * 1000);
  }
});

orderSchema.add({ orderNumber: { type: String, unique: true } });

module.exports = mongoose.model('Order', orderSchema);
