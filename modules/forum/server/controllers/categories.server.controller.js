'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Categorie = mongoose.model('Categorie'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Categorie
 */
exports.create = function(req, res) {
    var categorie = new Categorie(req.body);

    categorie.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(categorie);
        }
    });
};

/**
 * Show the current Categorie
*/
exports.read = function(req, res) {
    res.json(req.categorie);
};


/**
 * Update a Categorie
 */
exports.update = function(req, res) {
    var categorie = req.categorie;

    categorie.roles = req.body.roles;
    categorie.visibility = req.body.visibility;
    categorie.name = req.body.name;
    categorie.position = req.body.position;

    categorie.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(categorie);
        }
    });
};

/**
 * Delete an Categorie
 */
exports.delete = function(req, res) {
    var categorie = req.categorie;

    categorie.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(categorie);
        }
    });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {

    if (req.user.roles.indexOf('admin') >= 0) {
        Categorie.find().sort('position').exec(function(err, categories) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(categories);
            }
        });
    } else {
        Categorie.find({ visibility: { $in: req.user.roles } }).sort('position').exec(function(err, categories) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(categories);
            }
        });
    }


};

/**
 * Categorie middleware
 */
exports.categorieByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Categorie is invalid'
        });
    }

    Categorie.findById(id).exec(function (err, categorie) {
        if (err) {
            return next(err);
        } else if (!categorie) {
            return res.status(404).send({
                message: 'No Categorie with that identifier has been found'
            });
        }
        req.categorie = categorie;
        next();
    });
};
