'use strict';

/**
 * Module dependencies
 */
var bansPolicy = require('../policies/bans.server.policy'),
    bans = require('../controllers/bans.server.controller');

module.exports = function(app) {
  // Bans Routes
    app.route('/api/bans').all(bansPolicy.isAllowed)
    .get(bans.list)
    .post(bans.create);

    app.route('/api/bans/:banId').all(bansPolicy.isAllowed)
    .get(bans.read)
    .put(bans.update)
    .delete(bans.delete);

  // Finish by binding the Ban middleware
    app.param('banId', bans.banByID);
};
