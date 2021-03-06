/**
 * Module dependencies
 */
const passport = require('passport');

const TwitterStrategy = require('passport-twitter').Strategy;
const users = require('../../controllers/users.server.controller');

module.exports = (config) => {
  // Use twitter strategy
  passport.use(new TwitterStrategy(
    {
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL,
      passReqToCallback: true,
    },
    ((req, token, tokenSecret, profile, done) => {
    // Set the provider data and include tokens
      const providerData = profile._json;
      providerData.token = token;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      const displayName = profile.displayName.trim();
      const iSpace = displayName.indexOf(' '); // index of the whitespace following the firstName
      const firstName = iSpace !== -1 ? displayName.substring(0, iSpace) : displayName;
      const lastName = iSpace !== -1 ? displayName.substring(iSpace + 1) : '';

      const providerUserProfile = {
        firstName,
        lastName,
        displayName,
        username: profile.username,
        profileImageURL: profile.photos[0].value.replace('normal', 'bigger'),
        provider: 'twitter',
        providerIdentifierField: 'id_str',
        providerData,
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }),
  ));
};
