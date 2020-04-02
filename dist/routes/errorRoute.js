'use strict';

var express = require('express');
var router = express.Router();
var url = require('url');

var _require = require('../constant'),
    ROUTE = _require.ROUTE,
    VIEW = _require.VIEW;

router.get(ROUTE.error, function (req, res) {
    res.status(404).render(VIEW.error, {
        errmsg: req.query.errmsg || '404. Sidan finns inte!',
        token: req.cookies.jsonwebtoken ? true : false
    });
});

router.get(ROUTE.wildcard, function (req, res) {
    res.redirect(url.format({
        pathname: ROUTE.error,
        query: {}
    }));
});

module.exports = router;