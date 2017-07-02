'use strict';

/**
 * Module dependencies
 */
var Acl = require('acl');

// Using the memory backend
Acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke Categories Permissions
 */
exports.invokeRolesPolicies = function () {
    Acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/categories',
            permissions: '*'
        }, {
            resources: '/api/categories/:categorieId',
            permissions: '*'
        }]
    }, {
        roles: ['team'],
        allows: [{
            resources: '/api/categories',
            permissions: ['get']
        }, {
            resources: '/api/categories/:categorieId',
            permissions: ['get']
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/categories',
            permissions: ['get']
        }, {
            resources: '/api/categories/:categorieId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Categories Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Categorie is being processed and the current user created it then allow any manipulation
    if (req.categorie && req.user && req.categorie.user && req.categorie.user.id === req.user.id) {
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
