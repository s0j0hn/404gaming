'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Categorie Schema
 */
var CategorieSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Categorie name',
        trim: true
    },
    position: {
        type: Number,
        min: 1,
        max: 65,
        required: 'Please fill Categorie position number'
    },
    visibility: {
        type: String,
        enum: ['admin', 'team', 'user'],
        default: 'user'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Categorie', CategorieSchema);
