/**
 * Module dependencies
 */
const passport = require('passport');

const PayPalStrategy = require('passport-paypal-openidconnect').Strategy;
const users = require('../../controllers/users.server.controller');

module.exports = (config) => {
  passport.use(new PayPalStrategy(
    {
      clientID: config.paypal.clientID,
      clientSecret: config.paypal.clientSecret,
      callbackURL: config.paypal.callbackURL,
      scope: 'openid profile email',
      sandbox: config.paypal.sandbox,
      passReqToCallback: true,

    },
    ((req, accessToken, refreshToken, profile, done) => {
    // Set the provider data and include tokens
      const providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      const providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile._json.email,
        username: profile.username,
        provider: 'paypal',
        providerIdentifierField: 'user_id',
        providerData,
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }),
  ));
};
