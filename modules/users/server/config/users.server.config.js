/**
 * Module dependencies
 */
const path = require('path');

const config = require(path.resolve('./config/config'));
const passport = require('passport');
// const User = require('mongoose').model('User')

const UserService = require('../services/user.service');

/**
 * Module init function
 */
module.exports = (app) => {
  // Serialize identifiable user's information to the session
  // so that it can be pulled back in another request
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize get the user identifying information that we saved
  // in `passport.serializeUser()` and resolves the user account
  // from it so it can be saved in `req.user`
  passport.deserializeUser(async (id, done) => {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach((strategy) => {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
