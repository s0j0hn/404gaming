'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    CommentArticle = mongoose.model('CommentArticle'),
    Article = mongoose.model('Article'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a comment
 */
exports.create = function (req, res) {
    var comment = new CommentArticle(req.body);
    comment.user = req.user;

    comment.save(function (err) {
        if (err) {
            return res.status(400).send({
                error_message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(comment);
        }
    });
};

/**
 * Show the current comment
 */
exports.read = function (req, res) {
    res.json(req.comment);
};/*

/**
 * Update a comment
 */
exports.update = function (req, res) {
    var comment = req.comment;
    var isCurrentUserOwnerOrAdmin = !!(req.user && comment.user && comment.user._id.toString() === req.user._id.toString() || req.user.roles.indexOf('admin') >= 0);

    comment.content = req.body.content;

    comment.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else if (isCurrentUserOwnerOrAdmin) {
            res.json(comment);
        } else {
            return res.status(403).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });
};

/**
 * Delete an comment
 */
exports.delete = function (req, res) {
    var comment = req.comment;
    var isCurrentUserOwnerOrAdmin = !!(req.user && comment.user && comment.user._id.toString() === req.user._id.toString() || req.user.roles.indexOf('admin') >= 0);

    comment.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else if (isCurrentUserOwnerOrAdmin) {
            res.json(comment);
        } else {
            return res.status(403).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });
};

/**
 * List of Comments
 */
exports.list = function (req, res) {

    var id = req.query.articleId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'ArticleId is invalid'
        });
    }

    CommentArticle.find({ 'article': mongoose.Types.ObjectId(id) }).sort('created').populate('user', 'username profileImageURL created roles').exec(function (err, comments) {
        if (err) {
            return res.status(400).send({
                error_message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(comments);
        }
    });
};

/**
 * CommentArticle middleware
 */
exports.commentByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'CommentArticle is invalid'
        });
    }

    CommentArticle.findById(id).populate('user', 'username created profileImageURL').exec(function (err, comment) {
        if (err) {
            return next(err);
        } else if (!comment) {
            return res.status(404).send({
                message: 'No comment with that identifier has been found'
            });
        }
        req.comment = comment;
        next();
    });
};
