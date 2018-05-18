/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const path = require('path');

// const config = require(path.resolve('./config/config'));
const chalk = require('chalk');

/**
 * Seeds the User collection with document (Article)
 * and provided options.
 */
function seed(doc, { overwrite }) {
  const Article = mongoose.model('Article');

  function findAdminUser(skip) {
    const User = mongoose.model('User');

    return new Promise((resolve, reject) => {
      if (skip) {
        return resolve(true);
      }

      User
        .findOne({
          roles: { $in: ['admin'] },
        })
        .exec((err, admin) => {
          if (err) {
            return reject(err);
          }

          doc.user = admin;

          return resolve();
        });
    });
  }

  function skipDocument() {
    return new Promise((resolve, reject) => {
      Article
        .findOne({
          title: doc.title,
        })
        .exec((err, existing) => {
          if (err) {
            return reject(err);
          }

          if (!existing) {
            return resolve(false);
          }

          if (existing && !overwrite) {
            return resolve(true);
          }

          // Remove Article (overwrite)

          existing.remove((err) => {
            if (err) {
              return reject(err);
            }

            return resolve(false);
          });
        });
    });
  }

  function add(skip) {
    return new Promise((resolve, reject) => {
      if (skip) {
        return resolve({
          message: chalk.yellow(`Database Seeding: Article\t${doc.title} skipped`),
        });
      }

      const article = new Article(doc);

      article.save((err) => {
        if (err) {
          return reject(err);
        }

        return resolve({
          message: `Database Seeding: Article\t${article.title} added`,
        });
      });
    });
  }

  return new Promise((resolve, reject) => {
    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
}

/**
 * Article Schema
 */
const ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank',
  },
  content: {
    type: String,
    default: '',
    trim: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
});

ArticleSchema.statics.seed = seed;

mongoose.model('Article', ArticleSchema);
