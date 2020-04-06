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
    try {
        var cart = await getCart(req.body.userInfo._id);
        var session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cart.map(function (item) {
                return {
                    name: item.product.album,
                    amount: item.product.price * 100,
                    quantity: item.quantity,
                    currency: "sek"
                };
            }),
            customer_email: req.body.userInfo.email,
            success_url: req.protocol + '://' + req.get('Host') + ROUTE.confirmation,
            cancel_url: req.protocol + '://' + req.get('Host') + ROUTE.error + '?errmsg=Stripe error'
        });
        var stripeVar = {
            publicKey: STRIPE.public,
            sessionId: session.id
        };
        var totalAmount = session.display_items.map(function (item) {
            return item.amount;
        }).reduce(function (acc, cur) {
            return acc + cur;
        }) / 100;
        return res.status(202).render(VIEW.checkout, {
            ROUTE: ROUTE,
            cart: cart,
            showUserInfo: req.body.userInfo,
            stripeVar: stripeVar,
            totalAmount: totalAmount,
            token: req.cookies.jsonwebtoken ? true : false
        });
    } catch (e) {
        console.log(e);
        return res.status(202).render(VIEW.checkout, {
            ROUTE: ROUTE,
            showUserInfo: 'empty cart',
            token: req.cookies.jsonwebtoken ? true : false
        });
    }
});

router.post(ROUTE.checkout, verifyToken, async function (req, res) {
    try {
        /* Fungerar inte...
        await clearCart(req.body.userInfo._id);*/
        res.redirect(ROUTE.confirmation);
    } catch (e) {
        console.error(e);
        res.redirect(ROUTE.error);
    }
});

router.get(ROUTE.confirmation, verifyToken, async function (req, res) {
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

var clearCart = async function clearCart(userId) {
    return await Order.deleteMany({ user: userId });
};

module.exports = router;