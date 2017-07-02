'use strict';

/**
 * Module dependencies
 */
var Acl = require('acl');
var jwt = require('jsonwebtoken');

// Using the memory backend
Acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke Bans Permissions
 */
exports.invokeRolesPolicies = function () {
    Acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/bans',
            permissions: '*'
        }, {
            resources: '/api/bans/:banId',
            permissions: '*'
        }]
    }]);
};

/**
 * Check If Bans Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var token;
    var roles = (req.user) ? req.user.roles : ['guest'];

    if (req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
            var scheme = parts[0],
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            return res.status(401).send('Format is Authorization: Bearer [token]');
        }
    } else if (req.params.token) {
        token = req.params.token;
        var decodedUser = jwt.decode(token, 'Test123456');
        if (decodedUser._id) {
            req.user = decodedUser;
            roles = req.user.roles;
        }
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    }

    // If an Ban is being processed and the current user created it then allow any manipulation
    if (req.ban && req.user && req.ban.user && req.ban.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    Acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred
            return res.status(500).send('Unexpected authorization error');
        } else if (isAllowed) {
                // Access granted! Invoke next middleware
            return next();
        } else {
            return res.status(403).json({
                message: 'User is not authorized'
            });
        }
    });

};
