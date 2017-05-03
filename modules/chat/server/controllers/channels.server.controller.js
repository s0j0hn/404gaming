'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Channel = mongoose.model('Channel'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a channel
 */
exports.create = function (req, res) {
    var channel = new Channel(req.body);
    channel.owner = req.user;
    channel.users.push(req.user._id);

    channel.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(channel);
        }
    });
};

/**
 * Show the current channel
 */
exports.read = function (req, res) {
    res.json(req.channel);
};

/**
 * Update a channel
 */
exports.update = function (req, res) {
    var channel = req.channel;

    if (req.user && req.user._id === channel.owner){
        channel.name = req.body.name;
        channel.description = req.body.description;
        channel.users = req.body.users;
        channel.moderators = req.body.moderators;

    } else if (req.user && channel.moderators.indexOf(req.user._id)){
        channel.users = req.body.users;
    } else {
        return res.status(400).send({
            message: 'You can\'t modify this channel'
        });
    }

    channel.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(channel);
        }
    });
};

/**
 * Jain a channel
 */
exports.joinChannel = function (req, res) {
    var channel = req.channel;
    channel.users.push(req.user._id);
    channel.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(channel);
        }
    });
};

/**
 * Quit a channel
 */
exports.quitChannel = function (req, res) {
    var channel = req.channel;
    channel.users.pull(req.user._id);
    channel.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(channel);
        }
    });
};

/**
 * Delete an channel
 */
exports.delete = function (req, res) {
    var channel = req.channel;
    if (req.user && channel.owner === req.user._id){
        channel.remove(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(channel);
            }
        });
    }
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
    Channel.find().sort('-created')
        .populate('moderators', 'username')
        .populate('owner', 'username')
        .populate('users', 'username').exec(function (err, channels) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(channels);
        }
    });
};

/**
 * Article middleware
 */
exports.channelByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Article is invalid'
        });
    }

    Channel.findById(id)
        .populate('moderators', 'username')
        .populate('users', 'username')
        .populate('owner', 'username').exec(function (err, channel) {
        if (err) {
            return next(err);
        } else if (!channel) {
            return res.status(404).send({
                message: 'No channel with that identifier has been found'
            });
        }
        req.channel = channel;
        next();
    });
};
