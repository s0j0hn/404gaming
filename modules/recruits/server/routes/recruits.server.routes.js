'use strict';

/**
 * Module dependencies
 */
var recruitsPolicy = require('../policies/recruits.server.policy'),
    recruits = require('../controllers/recruits.server.controller');

module.exports = function(app) {
  // Recruits Routes
    app.route('/api/recruits').all(recruitsPolicy.isAllowed)
    .get(recruits.list)
    .post(recruits.create);

    app.route('/api/recruits/:recruitId').all(recruitsPolicy.isAllowed)
    .get(recruits.read)
    .put(recruits.update)
    .delete(recruits.delete);

  // Finish by binding the Recruit middleware
    app.param('recruitId', recruits.recruitByID);
};
