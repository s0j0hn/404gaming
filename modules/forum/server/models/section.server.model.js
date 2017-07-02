'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Section Schema
 */
var SectionSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Section name',
        trim: true
    },
    position: {
        type: Number,
        min: 1,
        max: 65,
        required: 'Please fill Section position number'
    },
    visibility: {
        type: String,
        enum: ['admin', 'team', 'user'],
        default: 'user'
    },
    latestPost: {
        type: Schema.ObjectId,
        ref: 'Topic'
    },
    replys: {
        type: Number,
        default: 0
    },
    posts: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    categorie: {
        type: Schema.ObjectId,
        ref: 'Categorie'
    }
});

mongoose.model('Section', SectionSchema);
