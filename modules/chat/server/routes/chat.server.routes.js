'use strict';

/**
 * Module dependencies.
 */
var channelsPolicy = require('../policies/channels.server.policy'),
    channels = require('../controllers/channels.server.controller.js');

module.exports = function (app) {
    // Articles collection routes
    app.route('/api/channels').all(channelsPolicy.isAllowed)
        .get(channels.list)
        .post(channels.create);

    // Single channel routes
    app.route('/api/channels/:channelId').all(channelsPolicy.isAllowed)
        .get(channels.read)
        .put(channels.update)
        .delete(channels.delete);

    app.route('/api/channels/:channelId/join').all(channelsPolicy.isAllowed)
        .put(channels.joinChannel);

    app.route('/api/channels/:channelId/quit').all(channelsPolicy.isAllowed)
        .put(channels.quitChannel);
    
    app.param('channelId', channels.channelByID);

};
