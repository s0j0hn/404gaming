'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

function contentLimit(val) {
    return val.length <= 1000;
}
/**
 * Reply Schema
 */
var ChatMessage = new Schema({
    content: {
        type: String,
        required: true,
        validate: [contentLimit, 'The value of name `{PATH}` (`{VALUE}`) exceeds the maximum allowed length 1000.']
    },
    channel:{
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

mongoose.model('ChatMessage', ChatMessage);
