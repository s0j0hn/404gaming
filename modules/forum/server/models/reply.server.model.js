'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Reply Schema
 */
var ReplySchema = new Schema({
    content: {
        type: String,
        default: '',
        required: 'Please fill Reply content',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    topic: {
        type: Schema.ObjectId,
        ref: 'Topic',
        required: 'Please fill Reply Topic'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'Please fill Reply User'
    }
});

mongoose.model('Reply', ReplySchema);
