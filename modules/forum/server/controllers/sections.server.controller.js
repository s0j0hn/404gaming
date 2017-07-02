'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Section = mongoose.model('Section'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Section
 */
exports.create = function(req, res) {
    var section = new Section(req.body);
    section.categorie = req.body.categorie;

    section.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(section);
        }
    });
};

/**
 * Show the current Section
 */
exports.read = function(req, res) {
    res.json(req.section);
};

/**
 * Update a Section
 */
exports.update = function(req, res) {
    var section = req.section;

    section = _.extend(section, req.body);

    section.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(section);
        }
    });
};

/**
 * Delete an Section
 */
exports.delete = function(req, res) {
    var section = req.section;

    section.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(section);
        }
    });
};

/**
 * List of Sections
 */
exports.list = function(req, res) {

    if (req.user.roles.indexOf('admin') >= 0) {
        Section.find().sort('position')
            .populate('categorie', 'name visibility')
            .populate('latestPost', 'name created user')
            .exec(function(err, sections) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(sections);
                }
            });
    } else {
        Section.find({ visibility: { $in: req.user.roles } }).sort('position')
            .populate('categorie', 'name visibility')
            .populate('latestPost', 'name created')
            .exec(function(err, sections) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(sections);
                }
            });
    }
};

/**
 * Section middleware
 */
exports.sectionByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Section is invalid'
        });
    }

    Section.findById(id).populate('categorie', 'name visibility').exec(function (err, section) {
        if (err) {
            return next(err);
        } else if (!section) {
            return res.status(404).send({
                message: 'No Section with that identifier has been found'
            });
        }
        req.section = section;
        next();
    });
};
