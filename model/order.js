const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaOrder = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    modified: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Order = mongoose.model("Order", schemaOrder)

module.exports = Order
