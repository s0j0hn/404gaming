'use strict';

/**
 * Module dependencies.
 */
var Acl = require('acl');

// Using the memory backend
Acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
    Acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/users',
            permissions: '*'
        }, {
            resources: '/api/users/:userId',
            permissions: '*'
        }]
    }, {
        roles: ['team'],
        allows: [{
            resources: '/api/users',
            permissions: ['get']
        }, {
            resources: '/api/users/:userId',
            permissions: ['get']
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/users',
            permissions: ['get']
        }, {
            resources: '/api/users/:userId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an user is being processed and the current user created it then allow any manipulation
    if (req.user && req.user && req.user.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    Acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred.
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
