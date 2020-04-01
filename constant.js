const VIEW = {
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
}

const ROUTE = {
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
    checkout: '/checkout',
    confirmation: '/checkout/confirmation',
    error: '/error',
    wildcard: '/*',
    resetpassword: '/resetpassword',
    resetpasswordToken: '/resetpassword/:token', 
    wishlistRemoveId: '/remove/:id'
}

const PRODUCT = {
    perPage: 4,
    genres: ["Rock", "Pop", "Soul", "Rap", "Rnb", "Blues", "Disco", "Jazz", "Classic"]
}

const QUERY_SEPARATOR = ',';

module.exports = {
    VIEW,
    ROUTE,
    PRODUCT,
    QUERY_SEPARATOR
}
