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
            resources: '/api/channels',
            permissions: '*'
        }, {
            resources: '/api/channels/:channelId',
            permissions: '*'
        }, {
            resources: '/api/channels/:channelId/join',
            permissions: '*'
        }, {
            resources: '/api/channels/:channelId/quit',
            permissions: '*'
        }]
    }, {
        roles: ['team'],
        allows: [{
            resources: '/api/channels',
            permissions: ['get','post']
        }, {
            resources: '/api/channels/:channelId',
            permissions: ['get','put']
        }, {
            resources: '/api/channels/:channelId/join',
            permissions: ['post']
        }, {
            resources: '/api/channels/:channelId/quit',
            permissions: ['post']
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/channels',
            permissions: ['get','post']
        }, {
            resources: '/api/channels/:channelId',
            permissions: ['get','put']
        }, {
            resources: '/api/channels/:channelId/join',
            permissions: ['put']
        }, {
            resources: '/api/channels/:channelId/quit',
            permissions: ['put']
        }]
    }]);
};

/**
 * Check If Channels Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an channel is being processed and the current user created it then allow any manipulation
    if (req.channel && req.user && req.channel.owner.id === req.user.id) {
        return next();
    }

    // Check for user roles
    Acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            } else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
