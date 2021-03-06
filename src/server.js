const express = require('express');
const sassMiddleware = require('node-sass-middleware');

const adminRoute = require('../routes/adminRoute');
const userRoute = require('../routes/userRoute');
const checkOutRoute = require('../routes/checkoutRoute');
const productRoute = require('../routes/productRoute');
const errorRoute = require('../routes/errorRoute');
const cookieParser = require('cookie-parser');
const orderRoute = require('../routes/orderRoute');

const app = express();

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

module.exports = {app}
