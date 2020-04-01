const express = require('express');
const router = express.Router();
const url = require('url');
const { ROUTE, VIEW } = require('../constant');

router.get(ROUTE.error, (req, res) => {
    res.status(404).render(VIEW.error, {
        errmsg: req.query.errmsg || '404. Sidan finns inte!',
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    });
})

router.get(ROUTE.wildcard, (req, res) => {
    res.redirect(url.format({
        pathname: ROUTE.error,
        query: {}
    }));
})

module.exports = router;
