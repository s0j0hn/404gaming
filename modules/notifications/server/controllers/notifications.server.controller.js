'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Notification = mongoose.model('Notification'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Notification
 */
exports.create = function(req, res) {
    var notification = new Notification(req.body);
    notification.user = req.user;

    notification.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(notification);
        }
    });
};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {
    if (req.notification.user._id === req.user._id) {
        res.json(req.notification);
    } else {
        res.status(400).send({
            message: 'Not your notification'
        });
    }
};

/**
 * Update a Notification
 */
exports.update = function(req, res) {
    var notification = req.notification;

    notification = _.extend(notification, req.body);

    notification.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(notification);
        }
    });
};

/**
 * Delete an Notification
 */
exports.delete = function(req, res) {
    var notification = req.notification;

    notification.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(notification);
        }
    });
};

/**
 * List of Notifications
 */
exports.list = function(req, res) {
    Notification.find({ 'user': req.user._id })
        .sort('-created')
        .populate('user', 'username roles rank')
        .exec(function(err, notifications) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(notifications);
            }
        });
};

/**
 * Notification middleware
 */
exports.notificationByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Notification is invalid'
        });
    }

    Notification.findById(id).populate('user', 'username roles rank').exec(function (err, notification) {
        if (err) {
            return next(err);
        } else if (!notification) {
            return res.status(404).send({
                message: 'No Notification with that identifier has been found'
            });
        }
        req.notification = notification;
        next();
    });
};
