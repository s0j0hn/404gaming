'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

function nameLimit(val) {
    return val.length <= 46;
}

function contentLimit(val) {
    return val.length <= 6000;
}
/**
 * Reply Schema
 */
var TopicSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Topic title ',
        trim: true,
        validate: [nameLimit, 'The value of name `{PATH}` (`{VALUE}`) exceeds the maximum allowed length 46.']
    },
    content: {
        type: String,
        default: '',
        trim: true,
        validate: [contentLimit, 'The value of name `{PATH}` (`{VALUE}`) exceeds the maximum allowed length 2000.']
    },
    views: {
        type: Number,
        default: 0
    },
    replys: {
        type: Number,
        default: 0
    },
    blocked: {
        type: Boolean,
        default: false,
        required: 'Please fill specify topic is blocked ?'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    section: {
        type: Schema.ObjectId,
        ref: 'Section',
        required: 'Please fill Topic Section'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'Please fill Topic User'
    }
});

mongoose.model('Topic', TopicSchema);
