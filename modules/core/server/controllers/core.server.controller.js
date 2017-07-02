'use strict';

var validator = require('validator'),
    path = require('path'),
    config = require(path.resolve('./config/config'));


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
    // var safeUserObject = null;
    // if (req.user) {
    //     safeUserObject = {
    //         displayName: validator.escape(req.user.displayName),
    //         provider: validator.escape(req.user.provider),
    //         username: validator.escape(req.user.username),
    //         created: req.user.created.toString(),
    //         roles: req.user.roles,
    //         rank : req.user.rank,
    //         posts : req.user.posts,
    //         warnings: req.user.warnings,
    //         ip_address: req.user.ip_address,
    //         replys: req.user.replys,
    //         views: req.user.views,
    //         profileImageURL: req.user.profileImageURL,
    //         email: validator.escape(req.user.email),
    //         lastName: validator.escape(req.user.lastName),
    //         firstName: validator.escape(req.user.firstName),
    //         additionalProvidersData: req.user.additionalProvidersData
    //     };
    // }

    res.render('modules/core/server/views/index', {
        user: req.user || null,
        sharedConfig: JSON.stringify(config.shared)
    });

};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {

    res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

    res.status(404).format({
        'text/html': function () {
            res.render('modules/core/server/views/404', {
                url: req.originalUrl
            });
        },
        'application/json': function () {
            res.json({
                error: 'Path not found'
            });
        },
        'default': function () {
            res.send('Path not found');
        }
    });
};
