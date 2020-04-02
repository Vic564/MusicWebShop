'use strict';

var express = require('express');
var sassMiddleware = require('node-sass-middleware');

var adminRoute = require('../routes/adminRoute');
var userRoute = require('../routes/userRoute');
var checkOutRoute = require('../routes/checkoutRoute');
var productRoute = require('../routes/productRoute');
var errorRoute = require('../routes/errorRoute');
var cookieParser = require('cookie-parser');
var orderRoute = require('../routes/orderRoute');

var app = express();

app.use(sassMiddleware({
    src: 'sass',
    dest: 'public',
    outputStyle: 'compressed'
}));

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(express.json());

app.use(checkOutRoute);

app.use(adminRoute);

app.use(userRoute);

app.use(productRoute);

app.use(orderRoute);

app.use(errorRoute);

module.exports = { app: app };