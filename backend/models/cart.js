const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
