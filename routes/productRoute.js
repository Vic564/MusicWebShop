const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const { ROUTE, VIEW, PRODUCT } = require('../constant');
const url = require('url');

router.get(ROUTE.index, async (req, res) => {
    let displayList = [];
    for (const genre of PRODUCT.genres) {
        const img = await Product.findOne({ genre: genre }, { imgUrl: 1, _id: 0 });
        if (img) {
            displayList.push({
                img: img.imgUrl,
                genre: genre
            });
        }
    }
    res.render(VIEW.index, {
        displayList: displayList,
        productListRoute: ROUTE.gallery,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    });
})

router.get(ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(VIEW.product, { oneProduct, token: (req.cookies.jsonwebtoken !== undefined) ? true : false });
})

router.get(ROUTE.gallery, async (req, res) => {
    if (!req.query.page) {
        req.query.page = 1;
        res.redirect(url.format({
            pathname: ROUTE.gallery,
            query: req.query
        }));
    } else {
        handleQuery(req.query, req.cookies.jsonwebtoken)
            .then(object => res.render(VIEW.gallery, object))
            .catch(error => res.redirect(url.format({
                pathname: ROUTE.error,
                query: {
                    errmsg: error.errmsg
                }
            })));
    }
})

const handleQuery = async (query, token) => {
    return new Promise(async (resolve, reject) => {
        pageIsInteger(query.page)
            .then(() => createFilter(query))
            .then(queryObject => resolve(getData(queryObject, token)))
            .catch(error => reject(error));
    });
}

const pageIsInteger = async (page) => {
    return new Promise(async (resolve, reject) => {
        if (Number.isInteger(+page)) {
            resolve();
        } else {
            let error = new Error();
            error.name = "Invalid Query";
            error.description = "page is not an integer";
            error.errmsg = "Kunde inte hitta sidan";
            reject(error);
        }
    })
}

const createFilter = async (query) => {
    return new Promise(async (resolve, reject) => {
        let filter = {};
        if (query.genre) {
            filter.genre = {
                "$regex": query.genre.replace(",", "|"),
                "$options": "i"
            };
        }
        if (query.artist) {
            filter.artist = {
                "$regex": query.artist.replace(",", "|"),
                "$options": "i"
            };
        }
        if (query.album) {
            filter.album = {
                "$regex": query.album.replace(",", "|"),
                "$options": "i"
            };
        }
        resolve({
            page: +query.page,
            filter: filter
        });
    })
}

const getData = async (queryObject, token) => {
    return new Promise(async (resolve, reject) => {
        const page = queryObject.page;
        const filter = queryObject.filter;
        const productAmount = await Product.find(filter).countDocuments();
        const pageAmount = Math.ceil(productAmount / PRODUCT.perPage);
        if ((page >= 1) && (page <= pageAmount)) {
            const productList = await Product.find(filter).skip(PRODUCT.perPage * (page - 1)).limit(PRODUCT.perPage)
            let search = [];
            for (const [key, value] of Object.entries(filter)) {
                search.push(`${key}=${value.$regex.replace("|", ",")}`)
            }
            resolve({
                token: token ? true : false,
                productList,
                productAmount,
                currentPage: page,
                isFirst: page <= 1,
                isSecond: page === 2,
                isLast: page === pageAmount,
                isSecondLast: page === (pageAmount - 1),
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: pageAmount,
                ROUTE: ROUTE,
                search: search.join("&")
            });
        } else if (productAmount < 1) {
            let error = new Error();
            error.name = "Invalid Query";
            error.description = "no hits in database";
            error.errmsg = "Inga träffar för din sökning";
            reject(error);
        } else {
            let error = new Error();
            error.name = "Invalid Query";
            error.description = "page is not within range";
            error.errmsg = "Kunde inte hitta sidan";
            reject(error);
        }
    })
}

module.exports = router;
