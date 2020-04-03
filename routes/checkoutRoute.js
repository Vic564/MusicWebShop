const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const { STRIPE } = require('../config/config')
const UserModel = require('../model/user');
const verifyToken = require('./verifyToken');
const stripe = require('stripe')(STRIPE.secret);
const Order = require('../model/order');

router.get(ROUTE.checkout, verifyToken, async (req, res) => {
    try {
        const cart = await getCart(req.body.userInfo._id);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cart.map(item => {
                return {
                    name: item.product.album,
                    amount: item.product.price * 100,
                    quantity: item.quantity, 
                    currency: "sek"
                }
            }),
            customer_email: req.body.userInfo.email,
            success_url: req.protocol +   "://" + req.get("Host") +  ROUTE.confirmation,
            cancel_url: req.protocol +   "://" + req.get("Host") +  ROUTE.error + '?errmsg=Stripe error'
        });
        const stripeVar = {
            publicKey: STRIPE.public,
            sessionId: session.id
        };
        const totalAmount = session.display_items.map(item => item.amount).reduce((acc, cur) => acc + cur) / 100;
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            cart,
            showUserInfo: req.body.userInfo,
            stripeVar,
            totalAmount: totalAmount,
            token: req.cookies.jsonwebtoken ? true : false
        });
    } catch (e) {
        console.log(e)
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: 'empty cart',
            token: req.cookies.jsonwebtoken ? true : false
        });
    }
})

router.post(ROUTE.checkout, verifyToken, async (req, res) => {
    try {
        /* Fungerar inte...
        await clearCart(req.body.userInfo._id);*/
        res.redirect(ROUTE.confirmation);
    } catch (e) {
        console.error(e);
        res.redirect(ROUTE.error);
    }
})

router.get(ROUTE.confirmation, verifyToken, async (req, res) => {
    const customer = {
        fName: req.body.fName,
        lName: req.body.lName,
        address: req.body.address,
        city: req.body.city,
        email: req.body.email
    }
    res.render(VIEW.confirmation, {
        customer,
        token: req.cookies.jsonwebtoken ? true : false
    });
})

const getCart = async (userId) => Order.find({user: userId}).populate("user product")

const clearCart = async (userId) => await Order.deleteMany({user: userId})

module.exports = router;
