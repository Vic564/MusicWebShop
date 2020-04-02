'use strict';

var router = require('express').Router();

var _require = require('../constant'),
    ROUTE = _require.ROUTE;

var verifyToken = require("./verifyToken");

var Order = require('../model/order');

router.post(ROUTE.order, verifyToken, async function (req, res) {
    await addToCart(req.body.userInfo._id, req.body.productId);
    res.status(200).json({ "answer": "ok" });
});

var addToCart = async function addToCart(userId, productId) {
    var duplicate = await Order.findOne({ user: userId, product: productId });
    if (duplicate) {
        await Order.updateOne({ _id: duplicate._id }, { '$inc': { quantity: 1 } });
    } else {
        var order = new Order({
            user: userId,
            product: productId
        });
        await order.save();
    }
};

module.exports = router;