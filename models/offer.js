const mongoose = require('mongoose')


const offerSchema = mongoose.Schema({
    product_id: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        required: true
    },
    submitted_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "NEW"
    },
})

module.exports = mongoose.model('Offer', offerSchema)

