'use strict';

/**
 * Module dependencies.
 */
var articlesPolicy = require('../policies/articles.server.policy.js'),
    articles = require('../controllers/articles.server.controller.js');
var commentsPolicy = require('../policies/comments.server.policy.js'),
    comments = require('../controllers/comments.server.controller.js');

module.exports = function (app) {
  // Articles collection routes
    app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
    app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  /**
   * Comments
   */
    app.route('/api/comments').all(commentsPolicy.isAllowed)
      .get(comments.list)
      .post(comments.create);

  // Single comment routes
    app.route('/api/comments/:commentId').all(commentsPolicy.isAllowed)
      .get(comments.read)
      .put(comments.update)
      .delete(comments.delete);

  // Finish by binding the comment middleware
    app.param('commentId', comments.commentByID);
    app.param('articleId', articles.articleByID);

};
