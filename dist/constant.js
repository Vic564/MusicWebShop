'use strict';

var VIEW = {
    index: 'index',
    admin: "admin",
    adminAddProduct: 'addProduct',
    createUser: "createuser",
    login: 'login',
    userAccount: 'useraccount',
    gallery: 'gallery',
    product: 'product',
    checkout: 'checkout',
    confirmation: 'confirmation',
    error: 'errors',
    resetpassword: 'resetpassword',
    resetform: 'resetform'
};

var ROUTE = {
    index: '/',
    admin: '/admin',
    adminAddProduct: '/admin/addproduct',
    login: '/login',
    logout: "/logout",
    userAccount: "/useraccount",
    createUser: "/createuser",
    gallery: '/gallery',
    product: '/gallery/:id',
    wishlistId: '/wishlist/:id',
    order: '/order',
    checkout: '/checkout',
    confirmation: '/checkout/confirmation',
    error: '/error',
    wildcard: '/*',
    resetpassword: '/resetpassword',
    resetpasswordToken: '/resetpassword/:token',
    wishlistRemoveId: '/remove/:id'
};

var PRODUCT = {
    perPage: 4,
    genres: ["Rock", "Pop", "Soul", "Rap", "Rnb", "Blues", "Disco", "Jazz", "Classic"]
};

var QUERY_SEPARATOR = {
    sep: {
        str: ',',
        regex: /,/g
    },
    or: {
        str: '|',
        regex: /\|/g
    }
};

module.exports = {
    VIEW: VIEW,
    ROUTE: ROUTE,
    PRODUCT: PRODUCT,
    QUERY_SEPARATOR: QUERY_SEPARATOR
};