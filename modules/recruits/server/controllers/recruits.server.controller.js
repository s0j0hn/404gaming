'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Recruit = mongoose.model('Recruit'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Recruit
 */
exports.create = function(req, res) {
    var recruit = new Recruit(req.body);
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    recruit.user = req.user;

    recruit.start_votes = null;
    recruit.end_votes = endDate.getTime();


    recruit.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(recruit);
        }
    });
};

/**
 * Show the current Recruit
 */
exports.read = function(req, res) {
    res.json(req.recruit);
};

/**
 * Update a Recruit
 */
exports.update = function(req, res) {
    var recruit = req.recruit;

    recruit = _.extend(recruit, req.body);
    recruit.updated = Date.now;

    recruit.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(recruit);
        }
    });
};

/**
 * Delete an Recruit
 */
exports.delete = function(req, res) {
    var recruit = req.recruit;

    recruit.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(recruit);
        }
    });
};

/**
 * List of Recruits
 */
exports.list = function(req, res) {
    if (req.user.roles.indexOf('admin') >= 0) {
        Recruit
            .find()
            .sort('-created')
            .populate('user', 'username profileImageURL created roles')
            .exec(function(err, recruits) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(recruits);
                }
            });
    } else if (req.user.roles.indexOf('team') >= 0) {
        Recruit
            .find({ 'status': { $in: ['INVotes', 'Accepted', 'Refused'] } })
            .sort('-created')
            .populate('user', 'username profileImageURL created roles')
            .exec(function(err, recruits) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(recruits);
                }
            });
    }
};

/**
 * Recruit middleware
 */
exports.recruitByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Recruit is invalid'
        });
    }

    Recruit.findById(id).populate('user', 'username profileImageURL created roles').exec(function (err, recruit) {
        if (err) {
            return next(err);
        } else if (!recruit) {
            return res.status(404).send({
                message: 'No Recruit with that identifier has been found'
            });
        }
        req.recruit = recruit;
        next();
    });
};
