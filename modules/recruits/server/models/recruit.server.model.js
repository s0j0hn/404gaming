'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Recruit Schema
 */
var RecruitSchema = new Schema({
    name: {
        type: String,
        required: 'Please fill Recruit name',
        trim: true
    },
    description: {
        type: String,
        required: 'Please fill Recruit description',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    start_votes: {
        type: Date
    },
    end_votes: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Refused', 'Accepted', 'INValidation', 'INVotes'],
        default: 'INValidation'
    },
    updated: {
        type: Date
    },
    votes: [{
        type: Schema.ObjectId,
        ref: 'Vote'
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Recruit', RecruitSchema);
