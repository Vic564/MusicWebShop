const router = require('express').Router();
const { ROUTE } = require('../constant');

const verifyToken = require("./verifyToken");

const Order = require('../model/order');

router.post(ROUTE.order, verifyToken, async (req, res) => {
    await addToCart(req.body.userInfo._id, req.body.productId);
    res.status(200).json({"answer": "ok"});
})

const addToCart = async (userId, productId) => {
    const duplicate = await Order.findOne({user: userId, product: productId});
    if (duplicate) {
        await Order.updateOne({_id: duplicate._id}, {'$inc': {quantity: 1}});
    } else {
        const order = new Order({
            user: userId,
            product: productId
        });
        await order.save();
    }
}

module.exports = router;
