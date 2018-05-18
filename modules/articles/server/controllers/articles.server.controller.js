/**
 * Module dependencies
 */
const path = require('path');

const mongoose = require('mongoose');

const Article = mongoose.model('Article');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = ({ body, user }, res) => {
  const article = new Article(body);
  article.user = user;

  article.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err),
      });
    }
    res.json(article);
  });
};

/**
 * Show the current article
 */
exports.read = (req, res) => {
  // convert mongoose document to JSON
  const article = req.article ? req.article.toJSON() : {};
  res.json(article);
};

/**
 * Update an article
 */
exports.update = (req, res) => {
  const article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err),
      });
    }
    res.json(article);
  });
};

/**
 * Delete an article
 */
exports.delete = (req, res) => {
  const article = req.article;

  article.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err),
      });
    }
    res.json(article);
  });
};

/**
 * List of Articles
 */
exports.list = (req, res) => {
  Article.find().sort('-created').populate('user', 'displayName').exec((err, articles) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err),
      });
    }
    res.json(articles);
  });
};

/**
 * Article middleware
 */
exports.articleByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid',
    });
  }

  Article.findById(id).populate('user', 'displayName').exec((err, article) => {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found',
      });
    }
    req.article = article;
    next();
  });
};
