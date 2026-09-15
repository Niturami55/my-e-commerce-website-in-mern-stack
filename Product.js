const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Saree', 'Suit', 'Lehenga', 'Kurti', 'Jeans', 'Tops', 'Dress', 'Dupatta', 'Accessories']
  },
  subCategory: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: 'Shopper\'s Stop'
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  }],
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size', '28', '30', '32', '34', '36', '38', '40', '42']
  }],
  colors: [{
    name: String,
    hex: String
  }],
  fabric: {
    type: String,
    default: ''
  },
  occasion: {
    type: String,
    enum: ['Casual', 'Formal', 'Party', 'Wedding', 'Festive', 'Daily Wear'],
    default: 'Casual'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, { timestamps: true });

// Calculate discount (Mongoose v8: no next() — use async)
productSchema.pre('save', async function() {
  if (!this.discount && this.originalPrice > 0 && this.price < this.originalPrice) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
});

// Update rating when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating = (total / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
