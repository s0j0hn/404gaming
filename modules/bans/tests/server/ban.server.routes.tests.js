'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ban = mongoose.model('Ban'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    ban;

/**
 * Ban routes tests
 */
describe('Ban CRUD tests', function () {

    before(function (done) {
    // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
    // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };

    // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

    // Save a user to the test db and create new Ban
        user.save(function () {
            ban = {
                name: 'Ban name'
            };

            done();
        });
    });

    it('should be able to save a Ban if logged in', function (done) {
        agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
          if (signinErr) {
              return done(signinErr);
          }

        // Get the userId
          var userId = user.id;

        // Save a new Ban
          agent.post('/api/bans')
          .send(ban)
          .expect(200)
          .end(function (banSaveErr, banSaveRes) {
            // Handle Ban save error
              if (banSaveErr) {
                  return done(banSaveErr);
              }

            // Get a list of Bans
              agent.get('/api/bans')
              .end(function (bansGetErr, bansGetRes) {
                // Handle Bans save error
                  if (bansGetErr) {
                      return done(bansGetErr);
                  }

                // Get Bans list
                  var bans = bansGetRes.body;

                // Set assertions
                  (bans[0].user._id).should.equal(userId);
                  (bans[0].name).should.match('Ban name');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to save an Ban if not logged in', function (done) {
        agent.post('/api/bans')
      .send(ban)
      .expect(403)
      .end(function (banSaveErr, banSaveRes) {
        // Call the assertion callback
          done(banSaveErr);
      });
    });

    it('should not be able to save an Ban if no name is provided', function (done) {
    // Invalidate name field
        ban.name = '';

        agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
          if (signinErr) {
              return done(signinErr);
          }

        // Get the userId
          var userId = user.id;

        // Save a new Ban
          agent.post('/api/bans')
          .send(ban)
          .expect(400)
          .end(function (banSaveErr, banSaveRes) {
            // Set message assertion
              (banSaveRes.body.message).should.match('Please fill Ban name');

            // Handle Ban save error
              done(banSaveErr);
          });
      });
    });

    it('should be able to update an Ban if signed in', function (done) {
        agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
          if (signinErr) {
              return done(signinErr);
          }

        // Get the userId
          var userId = user.id;

        // Save a new Ban
          agent.post('/api/bans')
          .send(ban)
          .expect(200)
          .end(function (banSaveErr, banSaveRes) {
            // Handle Ban save error
              if (banSaveErr) {
                  return done(banSaveErr);
              }

            // Update Ban name
              ban.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ban
              agent.put('/api/bans/' + banSaveRes.body._id)
              .send(ban)
              .expect(200)
              .end(function (banUpdateErr, banUpdateRes) {
                // Handle Ban update error
                  if (banUpdateErr) {
                      return done(banUpdateErr);
                  }

                // Set assertions
                  (banUpdateRes.body._id).should.equal(banSaveRes.body._id);
                  (banUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should be able to get a list of Bans if not signed in', function (done) {
    // Create new Ban model instance
        var banObj = new Ban(ban);

    // Save the ban
        banObj.save(function () {
      // Request Bans
            request(app).get('/api/bans')
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
            done();
        });

        });
    });

    it('should be able to get a single Ban if not signed in', function (done) {
    // Create new Ban model instance
        var banObj = new Ban(ban);

    // Save the Ban
        banObj.save(function () {
            request(app).get('/api/bans/' + banObj._id)
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Object).and.have.property('name', ban.name);

          // Call the assertion callback
            done();
        });
        });
    });

    it('should return proper error for single Ban with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
        request(app).get('/api/bans/test')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'Ban is invalid');

        // Call the assertion callback
          done();
      });
    });

    it('should return proper error for single Ban which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ban
        request(app).get('/api/bans/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'No Ban with that identifier has been found');

        // Call the assertion callback
          done();
      });
    });

    it('should be able to delete an Ban if signed in', function (done) {
        agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
          if (signinErr) {
              return done(signinErr);
          }

        // Get the userId
          var userId = user.id;

        // Save a new Ban
          agent.post('/api/bans')
          .send(ban)
          .expect(200)
          .end(function (banSaveErr, banSaveRes) {
            // Handle Ban save error
              if (banSaveErr) {
                  return done(banSaveErr);
              }

            // Delete an existing Ban
              agent.delete('/api/bans/' + banSaveRes.body._id)
              .send(ban)
              .expect(200)
              .end(function (banDeleteErr, banDeleteRes) {
                // Handle ban error error
                  if (banDeleteErr) {
                      return done(banDeleteErr);
                  }

                // Set assertions
                  (banDeleteRes.body._id).should.equal(banSaveRes.body._id);

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to delete an Ban if not signed in', function (done) {
    // Set Ban user
        ban.user = user;

    // Create new Ban model instance
        var banObj = new Ban(ban);

    // Save the Ban
        banObj.save(function () {
      // Try deleting Ban
            request(app).delete('/api/bans/' + banObj._id)
        .expect(403)
        .end(function (banDeleteErr, banDeleteRes) {
          // Set message assertion
            (banDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ban error error
            done(banDeleteErr);
        });

        });
    });

    it('should be able to get a single Ban that has an orphaned user reference', function (done) {
    // Create orphan user creds
        var _creds = {
            username: 'orphan',
            password: 'M3@n.jsI$Aw3$0m3'
        };

    // Create orphan user
        var _orphan = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'orphan@test.com',
            username: _creds.username,
            password: _creds.password,
            provider: 'local'
        });

        _orphan.save(function (err, orphan) {
      // Handle save error
            if (err) {
                return done(err);
            }

            agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
            if (signinErr) {
                return done(signinErr);
            }

          // Get the userId
            var orphanId = orphan._id;

          // Save a new Ban
            agent.post('/api/bans')
            .send(ban)
            .expect(200)
            .end(function (banSaveErr, banSaveRes) {
              // Handle Ban save error
                if (banSaveErr) {
                    return done(banSaveErr);
                }

              // Set assertions on new Ban
                (banSaveRes.body.name).should.equal(ban.name);
                should.exist(banSaveRes.body.user);
                should.equal(banSaveRes.body.user._id, orphanId);

              // force the Ban to have an orphaned user reference
                orphan.remove(function () {
                // now signin with valid user
                    agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                      if (err) {
                          return done(err);
                      }

                    // Get the Ban
                      agent.get('/api/bans/' + banSaveRes.body._id)
                      .expect(200)
                      .end(function (banInfoErr, banInfoRes) {
                        // Handle Ban error
                          if (banInfoErr) {
                              return done(banInfoErr);
                          }

                        // Set assertions
                          (banInfoRes.body._id).should.equal(banSaveRes.body._id);
                          (banInfoRes.body.name).should.equal(ban.name);
                          should.equal(banInfoRes.body.user, undefined);

                        // Call the assertion callback
                          done();
                      });
                  });
                });
            });
        });
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Ban.remove().exec(done);
        });
    });
});
