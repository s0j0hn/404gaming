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
      resources: '/api/articles',
      permissions: '*'
    }, {
      resources: '/api/articles/:articleId',
      permissions: '*'
    }]
  }, {
      roles: ['team'],
      allows: [{
          resources: '/api/articles',
          permissions: ['get']
      }, {
          resources: '/api/articles/:articleId',
          permissions: ['get']
      }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get']
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get']
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  if (req.article && req.user && req.article.user.id === req.user.id) {
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
