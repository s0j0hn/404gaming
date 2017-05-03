'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

function nameLimit(val) {
    return val.length <= 46;
}

function descriptionLimit(val) {
    return val.length <= 1000;
}
/**
 * Reply Schema
 */
var ChannelSchema = new Schema({
    name: {
        type: String,
        required: 'Please fill Channel name ',
        trim: true,
        validate: [nameLimit, 'The value of name `{PATH}` (`{VALUE}`) exceeds the maximum allowed length 46.']
    },
    description: {
        type: String,
        default: '',
        validate: [descriptionLimit, 'The value of name `{PATH}` (`{VALUE}`) exceeds the maximum allowed length 1000.']
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

mongoose.model('Channel', ChannelSchema);
