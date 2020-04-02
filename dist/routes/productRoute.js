'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var express = require('express');
var router = express.Router();
var Product = require('../model/product');

var _require = require('../constant'),
    ROUTE = _require.ROUTE,
    VIEW = _require.VIEW,
    PRODUCT = _require.PRODUCT,
    QUERY_SEPARATOR = _require.QUERY_SEPARATOR;

var url = require('url');

router.get(ROUTE.index, async function (req, res) {
    var displayList = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = PRODUCT.genres[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var genre = _step.value;

            var img = await Product.findOne({ genre: genre }, { imgUrl: 1, _id: 0 });
            if (img) {
                displayList.push({
                    img: img.imgUrl,
                    genre: genre
                });
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    res.render(VIEW.index, {
        displayList: displayList,
        productListRoute: ROUTE.gallery,
        token: req.cookies.jsonwebtoken ? true : false
    });
});

router.get(ROUTE.product, async function (req, res) {
    var oneProduct = await Product.findById({ _id: req.params.id });
    res.render(VIEW.product, {
        oneProduct: oneProduct,
        token: req.cookies.jsonwebtoken ? true : false
    });
});

router.get(ROUTE.gallery, async function (req, res) {
    if (!req.query.page) {
        req.query.page = 1;
        res.redirect(url.format({
            pathname: ROUTE.gallery,
            query: req.query
        }));
    } else {
        handleQuery(req.query, req.cookies.jsonwebtoken).then(function (object) {
            return res.render(VIEW.gallery, object);
        }).catch(function (error) {
            return res.redirect(url.format({
                pathname: ROUTE.error,
                query: {
                    errmsg: error.errmsg
                }
            }));
        });
    }
});

var handleQuery = async function handleQuery(query, token) {
    return pageIsInteger(query.page).then(function () {
        return createFilter(query);
    }).then(function (queryObject) {
        return getData(queryObject, token);
    }).catch(function (error) {
        throw error;
    });
};

var pageIsInteger = async function pageIsInteger(page) {
    if (Number.isInteger(+page)) {
        return;
    } else {
        var error = new Error();
        error.name = "Invalid Query";
        error.description = "page is not an integer";
        error.errmsg = "Kunde inte hitta sidan";
        throw error;
    }
};

var createFilter = async function createFilter(query) {
    var filter = {};
    if (query.genre) {
        filter.genre = {
            "$regex": query.genre.replace(QUERY_SEPARATOR.sep.regex, QUERY_SEPARATOR.or.str),
            "$options": "i"
        };
    }
    if (query.artist) {
        filter.artist = {
            "$regex": query.artist.replace(QUERY_SEPARATOR.sep.regex, QUERY_SEPARATOR.or.str),
            "$options": "i"
        };
    }
    if (query.album) {
        filter.album = {
            "$regex": query.album.replace(QUERY_SEPARATOR.sep.regex, QUERY_SEPARATOR.or.str),
            "$options": "i"
        };
    }
    return {
        page: +query.page,
        filter: filter
    };
};

var getData = async function getData(queryObject, token) {
    var page = queryObject.page;
    var filter = queryObject.filter;
    var productAmount = await Product.find(filter).countDocuments();
    var pageAmount = Math.ceil(productAmount / PRODUCT.perPage);
    if (page >= 1 && page <= pageAmount) {
        var productList = await Product.find(filter).skip(PRODUCT.perPage * (page - 1)).limit(PRODUCT.perPage);
        var search = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.entries(filter)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    key = _step2$value[0],
                    value = _step2$value[1];

                search.push(key + '=' + value.$regex.replace(QUERY_SEPARATOR.or.regex, QUERY_SEPARATOR.sep.str));
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return {
            token: token ? true : false,
            productList: productList,
            productAmount: productAmount,
            currentPage: page,
            isFirst: page <= 1,
            isSecond: page === 2,
            isLast: page === pageAmount,
            isSecondLast: page === pageAmount - 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: pageAmount,
            ROUTE: ROUTE,
            search: search.join("&")
        };
    } else if (productAmount < 1) {
        var error = new Error();
        error.name = "Invalid Query";
        error.description = "no hits in database";
        error.errmsg = "Inga träffar för din sökning";
        throw error;
    } else {
        var _error = new Error();
        _error.name = "Invalid Query";
        _error.description = "page is not within range";
        _error.errmsg = "Kunde inte hitta sidan";
        throw _error;
    }
};

module.exports = router;