'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * CommentArticle Schema
 */
var CommentArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    article: {
        type: Schema.ObjectId,
        ref: 'Article'
    }
});

mongoose.model('CommentArticle', CommentArticleSchema);
