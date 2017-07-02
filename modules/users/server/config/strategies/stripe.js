'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
    StripeStrategy = require('passport-stripe').Strategy,
    users = require('../../controllers/users.server.controller');

module.exports = function (config) {
    passport.use(new StripeStrategy({
        clientID: config.stripe.clientID,
        clientSecret: config.stripe.clientSecret,
        callbackURL: config.stripe.callbackURL,
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
            // Set the provider data and include tokens
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;

            // Create the user OAuth profile
            var displayName = profile.displayName ? profile.displayName.trim() : profile.username.trim();
            var iSpace = displayName.indexOf(' '); // index of the whitespace following the firstName
            var firstName = iSpace !== -1 ? displayName.substring(0, iSpace) : displayName;
            var lastName = iSpace !== -1 ? displayName.substring(iSpace + 1) : '';
            var email = (profile.emails && profile.emails.length) ? profile.emails[0].value : undefined;

            var providerUserProfile = {
                firstName: firstName,
                lastName: lastName,
                displayName: displayName,
                email: email,
                username: profile.username,
                // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                profileImageURL: (providerData.avatar_url) ? providerData.avatar_url : undefined,
                // jscs:enable
                provider: 'stripe',
                providerIdentifierField: 'id',
                providerData: providerData
            };

            // Save the user OAuth profile
            users.saveOAuthUserProfile(req, providerUserProfile, done);
        }));

};
