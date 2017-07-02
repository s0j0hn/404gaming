'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
    res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
    var user = req.model;

    // For security purposes only merge these parameters
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.displayName = user.firstName + ' ' + user.lastName;
    user.roles = req.body.roles;
    user.rank = req.body.rank;
    user.ip_address = req.body.ip_address;

    user.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(user);
    });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
    var user = req.model;

    user.remove(function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(user);
    });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
    User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'username').exec(function (err, users) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(users);
    });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }
    if (req.user.roles.indexOf('admin') >= 0) {
        User.findById(id, '-salt -password -providerData').exec(function (err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                return next(new Error('Failed to load user ' + id));
            }
            if (id != req.user._id) {
                user.views += 1;
                user.save(function () {

                });
            }
            req.model = user;
            next();
        });
    } else {
        User.findById(id, 'username roles created views replys posts profileImageURL rank').exec(function (err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                return next(new Error('Failed to load user ' + id));
            }
            if (id != req.user._id) {
                user.views += 1;
                user.save(function () {

                });
            }
            req.model = user;
            next();
        });
    }

};
