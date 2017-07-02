'use strict';

// var ipaddr = require('ipaddr.js'),
//     iplib = require('ip'),
//     mongoose = require('mongoose'),
//     validator = require('validator'),
//     Ban = mongoose.model('Ban');

var Acl = require('acl');

// Using the memory backend
Acl = new Acl(new Acl.memoryBackend());

/**
 * Check If user is banned
 */

// function getIP(req) {
//     var ipString = (req.headers['X-Forwarded-For'] ||
//         req.headers['x-forwarded-for'] ||
//         '').split(',')[0] ||
//         req.connection.remoteAddress;
//
//     if (ipaddr.isValid(ipString)) {
//         try {
//             var addr = ipaddr.parse(ipString);
//             if (ipaddr.IPv6.isValid(ipString) && addr.isIPv4MappedAddress()) {
//                 return addr.toIPv4Address().toString();
//             }
//             return addr.toNormalizedString();
//         } catch (e) {
//             return ipString;
//         }
//     }
//     return false;
// }

module.exports = function (app) {
    // Root routing
    var core = require('../controllers/core.server.controller');
    // Define error pages
    app.route('/server-error').get(core.renderServerError);

    // Return a 404 for all undefined api, module or lib routes
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

    // Define application route
    app.route('/*').get(core.renderIndex);
    // app.route('/*', Acl.middleware(), function(req, res, next) {
    //     var ip = getIP(req);
    //     Ban.find().sort('created').exec(function(err, bans) {
    //         if (err) {
    //             // An authorization error occurred.
    //             return res.status(500).send('Unexpected authorization error');
    //         } else {
    //             for (var i = 0; i < bans.length; i++) {
    //                 if (bans[i].address && iplib.cidrSubnet(bans[i].address).contains(ip)) {
    //                     res.status(422).render('modules/core/server/views/banned', {
    //                         ip: ip
    //                     });
    //                 } else {
    //                     // Access granted! Invoke next middleware
    //                     return next();
    //                 }
    //             }
    //         }
    //
    //     });
    // }).get(core.renderIndex);
};
