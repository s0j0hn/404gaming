'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

function labelLimit(val) {
    return val.length <= 100;
}
/**
 * Reply Schema
 */
var MessageSchema = new Schema({
    label: {
        type: String,
        required: true,
        validate: [labelLimit, 'The value of name `{PATH}` (`{VALUE}`) exceeds the maximum allowed length 100.']
    },
    blocked:{
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

mongoose.model('Message', MessageSchema);
