const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const { STRIPE } = require('../config/config')
const UserModel = require('../model/user');
const verifyToken = require('./verifyToken');
const stripe = require('stripe')(STRIPE.secret);
const Order = require('../model/order');

router.get(ROUTE.checkout, verifyToken, async (req, res) => {
    if (verifyToken) {
        const cart = await getCart(req.body.userInfo._id);
        console.log(cart)
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
            ROUTE,
            cart,
            showUserInfo: req.body.userInfo,
            stripePublicKey: STRIPE.public,
            token: req.cookies.jsonwebtoken ? true : false
        })
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: 'empty cart',
            token: req.cookies.jsonwebtoken ? true : false
        })
    }
})

router.post(ROUTE.checkout, verifyToken, async (req, res) => {
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

module.exports = router;
