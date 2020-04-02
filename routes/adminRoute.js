const express = require('express');
const router = express.Router();
const ProductModel = require('../model/product');
const { ROUTE, VIEW, PRODUCT } = require('../constant');
const request = require('request');
const config = require('../config/config');
const url = require("url");
const verifyAdminToken = require('./verifyAdminToken');

router.get(ROUTE.admin, verifyAdminToken, async (req, res) => {
    const productList = (await (ProductModel.find().populate('user', { _id: 1 }))).reverse()
    res.render(VIEW.admin, {
        productList,
        ROUTE,
        token: req.cookies.jsonwebtoken ? true : false
    })
})

router.post(ROUTE.admin, verifyAdminToken, (req, res) => {
    const artistSearchValue = req.body.artist;
    const fetchSpotifyApiData = (artistSearchValue) => {
        const client_id = config.spotify.client_id;
        const client_secret = config.spotify.client_secret;
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
    
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const spotifyToken = body.access_token;
                const options = {
                    url: `https://api.spotify.com/v1/search?\
                    q=artist:${artistSearchValue}\
                    &type=${config.spotify.query.type}\
                    &album_type=${config.spotify.query.albumType}\
                    &offset=${config.spotify.query.offset}\
                    &limit=${config.spotify.query.limit}`
                    .replace(/ /g, ''),
                    headers: {
                        Authorization: 'Bearer ' + spotifyToken,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                };
                request.get(options, function (error, response, body) {
                    const spotifyResponse = JSON.parse(body).albums;
                    const userInfo = req.body.userInfo;
                    if (!spotifyResponse) {
                        res.redirect(url.format({
                            pathname: ROUTE.error,
                            query: {
                                errmsg: 'Query till spotify error!'
                            }
                        }));
                    }
                    else if (spotifyResponse.items == 0) {
                        res.redirect(url.format({
                            pathname: ROUTE.error,
                            query: {
                                errmsg: 'Titeln saknas hos spotify!'
                            }
                        }));
                    } else {
                        const genres = PRODUCT.genres.filter(genre => {
                            return genre !== "All";
                        });
                        res.render(VIEW.adminAddProduct, {
                            ROUTE,
                            userInfo: userInfo,
                            spotifyResponse: spotifyResponse,
                            genres: genres,
                            token: req.cookies.jsonwebtoken ? true : false
                        });
                    }
                });
            }
        });
    };
    fetchSpotifyApiData(artistSearchValue);
})

router.post(ROUTE.adminAddProduct, verifyAdminToken, async (req, res) => {
    let genres = [];
    for (const property in req.body) {
        if (property.includes("genre")) {
            genres.push(property.replace("genre", ""));
        }
    }
    const product = await new ProductModel({
        artist: req.body.artist,
        album: req.body.album,
        tracks: req.body.tracks,
        spotifyId: req.body.spotifyId,
        imgUrl: req.body.imgUrl,
        genre: genres,
        price: req.body.price,
        addedBy: req.body.adminName,
        user: req.body.userInfo._id
    });
    product.validate(function (err) {
        if (err) {
            console.log(err);
            res.redirect(url.format({
                pathname: ROUTE.error,
                query: {
                    errmsg: 'Valideringsfel i Mongoose'
                }
            }));
        } else {
            product.save();
            res.redirect(ROUTE.admin);
        }
    });
})

module.exports = router;
