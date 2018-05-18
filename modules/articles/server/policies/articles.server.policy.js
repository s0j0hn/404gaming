/* eslint-disable new-cap */
/**
 * Module dependencies
 */
let Acl = require('acl');

// Using the memory backend
Acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = () => {
  Acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/articles',
      permissions: '*',
    }, {
      resources: '/api/articles/:articleId',
      permissions: '*',
    }],
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get'],
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get'],
    }],
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get'],
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get'],
    }],
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = ({
  user, article, route, method,
}, res, next) => {
  const roles = (user) ? user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  if (article && user && article.user && article.user.id === user.id) {
    return next();
  }

  // Check for user roles
  Acl.areAnyRolesAllowed(roles, route.path, method.toLowerCase(), (err, isAllowed) => {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    }
    if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    }
    return res.status(403).json({
      message: 'User is not authorized',
    });
  });
};
