'use strict';

var mongoose = require('mongoose');
require('dotenv').config();

var _require = require('./src/server'),
    app = _require.app;

var _require2 = require('./config/config'),
    MONGODB = _require2.MONGODB,
    PORT = _require2.PORT;

mongoose.connect(MONGODB.connection, MONGODB.options).then(function () {
    app.listen(PORT, function () {
        return console.log('App listening on port ' + PORT + '!');
    });
});