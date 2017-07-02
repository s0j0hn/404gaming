'use strict';

/**
 * Module dependencies
 */
var ipaddr = require('ipaddr.js'),
    iplib = require('ip'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Ban = mongoose.model('Ban'),
    User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
    '/page/authentication/signin',
    '/page/authentication/signup'
];


function getIP(req) {
    var ipString = (req.headers['X-Forwarded-For'] ||
        req.headers['x-forwarded-for'] ||
        '').split(',')[0] ||
        req.connection.remoteAddress;

    if (ipaddr.isValid(ipString)) {
        try {
            var addr = ipaddr.parse(ipString);
            if (ipaddr.IPv6.isValid(ipString) && addr.isIPv4MappedAddress()) {
                return addr.toIPv4Address().toString();
            }
            return addr.toNormalizedString();
        } catch (e) {
            return ipString;
        }
    }
    return 'unknown';
}

/**
 * Signup
 */
exports.signup = function (req, res) {
    // we get the right ipv4 or ipv6 of user
    var ip = getIP(req);
    var banned = false;

    Ban.find().sort('created').exec(function(err, bans) {
        for (var i = 0; i < bans.length; i++) {
            // var ban = bans[i];
            // for (var j = 0; j < req.user.ip_address.length; j++){
            if (iplib.cidrSubnet(bans[i].address).contains(ip)) {
                banned = true;
            }
            // }
        }
    });

    if (banned) {
        res.status(422).send({
            message: 'Your IP address is BANNED or using VPN/Proxy'
        });
    }

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init user and add missing fields
    var user = new User(req.body);
    user.provider = 'local';

    for (var i = 0; i < user.ip_address.length; i++) {
        if (user.ip_address[i] === ip || user.ip_address.length >= 0) {
            user.ip_address[i] = ip;
        } else {
            user.ip_address.push(ip);
            break;
        }
    }
    user.displayName = user.firstName + ' ' + user.lastName;

    // Then save the user
    user.save(function (err) {
        if (err) {
            res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    });
};
// /**
//  * Signin-token after passport token authentication
//  */
// exports.tokenAuth = function (req, res, next) {
//     passport.authenticate('local-token',{ session: false, scope: [] }, function(err, user, info) {
//         if (err || !user) {
//             res.status(400).send(info);
//         } else {
//             // Remove sensitive data before returning
//             user.password = undefined;
//             user.salt = undefined;
//
//             // return the user object (contains loginToken)
//             res.json(user);
//
//         }
//     })(req, res, next);
// };


/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
    var ip = getIP(req);
    var banned = false;

    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            res.status(422).send(info);
        } else if (user.roles.indexOf('banned') >= 0 || banned) {
            res.status(400).send({
                message: 'Your IP address is BANNED or using VPN/Proxy'
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            User.findById(user._id, 'username roles created posts ip_address').exec(function (err, user) {
                Ban.find().sort('created').exec(function(err, bans) {
                    for (var i = 0; i < bans.length; i++) {
                        for (var j = 0; j < user.ip_address.length; j++) {
                            if (iplib.cidrSubnet(bans[i].address).contains(user.ip_address[j])) {
                                banned = true;
                            }
                        }
                    }
                });
                if (err) {
                    res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else if (!user) {
                    res.status(400).send({
                        message: 'failed to load user'
                    });
                } else if (banned) {
                    res.status(422).send({
                        message: 'Your IP address is BANNED or using VPN/Proxy'
                    });
                }
                for (var i = 0; i < user.ip_address.length + 1; i++) {
                    if (user.ip_address[i] === ip || user.ip_address.length >= 0) {
                        user.ip_address[i] = ip;
                        break;
                    } else {
                        user.ip_address.push(ip);
                        break;
                    }
                }
                user.save(function (err) {
                    if (err) {
                        res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                });

            });

            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
    return function (req, res, next) {
        if (req.query && req.query.redirect_to)
            req.session.redirect_to = req.query.redirect_to;

        // Authenticate
        passport.authenticate(strategy, scope)(req, res, next);
    };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
    return function (req, res, next) {

        // info.redirect_to contains inteded redirect path
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
            }
            if (!user) {
                return res.redirect('/authentication/signin');
            }
            req.login(user, function (err) {
                if (err) {
                    return res.redirect('/authentication/signin');
                }

                return res.redirect(info.redirect_to || '/');
            });
        })(req, res, next);
    };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
    // Setup info object
    var info = {};

    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.session.redirect_to) === -1)
        info.redirect_to = req.session.redirect_to;

    if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function (err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                    user = new User({
                        firstName: providerUserProfile.firstName,
                        lastName: providerUserProfile.lastName,
                        username: availableUsername,
                        displayName: providerUserProfile.displayName,
                        profileImageURL: providerUserProfile.profileImageURL,
                        provider: providerUserProfile.provider,
                        providerData: providerUserProfile.providerData
                    });

                        // Email intentionally added later to allow defaults (sparse settings) to be applid.
                        // Handles case where no email is supplied.
                        // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
                    user.email = providerUserProfile.email;

                        // And save the user
                    user.save(function (err) {
                        return done(err, user, info);
                    });
                });
            } else {
                return done(err, user, info);
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        var user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) {
                user.additionalProvidersData = {};
            }

            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(function (err) {
                return done(err, user, info);
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
    var user = req.user;
    var provider = req.query.provider;

    if (!user) {
        return res.status(401).json({
            message: 'User is not authenticated'
        });
    } else if (!provider) {
        return res.status(400).send();
    }

    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
        delete user.additionalProvidersData[provider];

        // Then tell mongoose that we've updated the additionalProvidersData field
        user.markModified('additionalProvidersData');
    }

    user.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.login(user, function (err) {
                if (err) {
                    return res.status(400).send(err);
                } else {
                    return res.json(user);
                }
            });
        }
    });
};
