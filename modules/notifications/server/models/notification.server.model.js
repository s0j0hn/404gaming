'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Notification name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: '',
        required: 'Please fill Notification description',
        trim: true
    },
    topic: {
        type: Schema.ObjectId,
        ref: 'Topic'
    },
    section: {
        type: Schema.ObjectId,
        ref: 'Section'
    },
    vote: {
        type: Schema.ObjectId,
        ref: 'Vote'
    },
    link: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: 'information',
        enum: [
            'new_reply',
            'new_vote',
            'user_warning',
            'information',
            'vote_refused',
            'vote_adopted',
            'recrut_accepted',
            'recrut_refused',
            'forum_banned'
        ]
    },
    seen: {
        type: Boolean,
        default: false
    },
    icon_class: {
        type: String,
        enum: [
            'fa-envelope text-warning',
            'fa-ban text-danger',
            'fa-thumbs-o-up text-success',
            'fa-thumbs-o-down text-danger',
            'fa-exclamation-triangle  text-warning',
            'fa-pencil-square-o  text-primary'],
        default: 'fa-exclamation-triangle  text-warning'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'Please fill Notification User'
    }

});

mongoose.model('Notification', NotificationSchema);
