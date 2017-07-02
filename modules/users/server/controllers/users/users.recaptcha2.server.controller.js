'use strict';


var ipaddr = require('ipaddr.js'),
    iplib = require('ip'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Ban = mongoose.model('Ban'),
    User = mongoose.model('User');


exports.verifyRecaptcha = function (req, res) {

};
