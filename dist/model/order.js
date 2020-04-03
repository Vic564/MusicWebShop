"use strict";

var mongoose = require('mongoose');
var Schema = require("mongoose").Schema;

var schemaOrder = new Schema({
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
    }
}, {
    timestamps: true
});

var Order = mongoose.model("Order", schemaOrder);

module.exports = Order;