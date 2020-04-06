'use strict';

require('dotenv').config();

var validPort = function validPort(port) {
    var regex = new RegExp('^()([1-9][0-9]{0,3}|[1-5][0-9]{0,4}|6[0-4][0-9]{0,3}|65[0-4][0-9]{0,2}|655[0-2][0-9]|6553[0-5])$');
    return regex.test(port);
};

var PORT = validPort(process.env.PORT) ? parseInt(process.env.PORT) : 8080;

var mongodb = process.env.MONGODB || 'mongodb';
var dbUser = process.env.DBUSER || 'test';
var dbPassword = process.env.DBPASSWORD || 'test';
var dbHostname = process.env.DBHOSTNAME || 'localhost';
var dbName = process.env.DBNAME || 'todolistapp';
var dbQuery = process.env.DBQUERY || 'retryWrites=true&w=majority';
var dbAuth = process.env.DBAUTH == 'true';

var MONGODB = {
    connection: dbAuth ? mongodb + '://' + dbUser + ':' + dbPassword + '@' + dbHostname + '/' + dbName + '?' + dbQuery : mongodb + '://' + dbHostname + '/' + dbName + '?' + dbQuery,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
};

var spotify = {
    client_id: process.env.SPOTIFY_CLIENT_ID || 'needsconfig',
    client_secret: process.env.SPOTIFY_CLIENT_SECRET || 'needsconfig',
    query: {
        type: 'album',
        albumType: 'SINGLE',
        offset: 0,
        limit: 10
    }
};

var STRIPE = {
    public: process.env.STRIPE_PUBLIC || 'needsconfig',
    secret: process.env.STRIPE_SECRET || 'needsconfig'
};

var mailkey = {
    mailkey: process.env.SEND_GRID_KEY || 'needsconfig'
};

var tokenkey = {
    adminjwt: process.env.ADMIN_TOKEN || 'admintoken',
    userjwt: process.env.USER_TOKEN || 'usertoken'
};

var admin = {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin'
};

module.exports = { MONGODB: MONGODB, spotify: spotify, mailkey: mailkey, tokenkey: tokenkey, admin: admin, PORT: PORT, STRIPE: STRIPE };