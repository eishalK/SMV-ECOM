const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please add a customer ID']

    },

    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
    ],

    totalAmount: {
        type: Number,
        required: [true, 'Please add a total amount']

    },

    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'

    },


}, { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema)
