const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
        
    },

    description: {
        type: String,
        default: null
    
    },

    price: {
        type: Number,
        required: [true, 'Please add a price']
        
    },

    stock: {
        type: Number,
        default: 0
        
    },

    images: {
        type: [String],
        default: [],
        
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        
    },

}, { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema)
