'use strict';

var express = require('express');
var router = express.Router();

var _require = require('../constant'),
    ROUTE = _require.ROUTE,
    VIEW = _require.VIEW;

var _require2 = require('../config/config'),
    STRIPE = _require2.STRIPE;

var UserModel = require('../model/user');
var verifyToken = require('./verifyToken');
var stripe = require('stripe')(STRIPE.secret);
var Order = require('../model/order');

router.get(ROUTE.checkout, verifyToken, async function (req, res) {
    if (verifyToken) {
        var cart = await getCart(req.body.userInfo._id);
        console.log(cart);
        /*
        stripe.checkout.session.create({
            payment_method_types: ['card'],
            list_items: showUserInfo.cart.forEach(product => {
                return {
                    name: product.productId.name,
                    amount: product.productId.price,
                }
            })
        })*/
        res.status(202).render(VIEW.checkout, {
            ROUTE: ROUTE,
            cart: cart,
            showUserInfo: req.body.userInfo,
            stripePublicKey: STRIPE.public,
            token: req.cookies.jsonwebtoken ? true : false
        });
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE: ROUTE,
            showUserInfo: 'empty cart',
            token: req.cookies.jsonwebtoken ? true : false
        });
    }
});

router.post(ROUTE.checkout, verifyToken, async function (req, res) {
    var customer = {
        fName: req.body.fName,
        lName: req.body.lName,
        address: req.body.address,
        city: req.body.city,
        email: req.body.email
    };
    res.render(VIEW.confirmation, {
        customer: customer,
        token: req.cookies.jsonwebtoken ? true : false
    });
});

var getCart = async function getCart(userId) {
    return Order.find({ user: userId }).populate("user product");
};

module.exports = router;