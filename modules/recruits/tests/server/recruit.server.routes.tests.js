'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Recruit = mongoose.model('Recruit'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    recruit;

/**
 * Recruit routes tests
 */
describe('Recruit CRUD tests', function () {

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

    // Save a user to the test db and create new Recruit
        user.save(function () {
            recruit = {
                name: 'Recruit name'
            };

            done();
        });
    });

    it('should be able to save a Recruit if logged in', function (done) {
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

        // Save a new Recruit
          agent.post('/api/recruits')
          .send(recruit)
          .expect(200)
          .end(function (recruitSaveErr, recruitSaveRes) {
            // Handle Recruit save error
              if (recruitSaveErr) {
                  return done(recruitSaveErr);
              }

            // Get a list of Recruits
              agent.get('/api/recruits')
              .end(function (recruitsGetErr, recruitsGetRes) {
                // Handle Recruits save error
                  if (recruitsGetErr) {
                      return done(recruitsGetErr);
                  }

                // Get Recruits list
                  var recruits = recruitsGetRes.body;

                // Set assertions
                  (recruits[0].user._id).should.equal(userId);
                  (recruits[0].name).should.match('Recruit name');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to save an Recruit if not logged in', function (done) {
        agent.post('/api/recruits')
      .send(recruit)
      .expect(403)
      .end(function (recruitSaveErr, recruitSaveRes) {
        // Call the assertion callback
          done(recruitSaveErr);
      });
    });

    it('should not be able to save an Recruit if no name is provided', function (done) {
    // Invalidate name field
        recruit.name = '';

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

        // Save a new Recruit
          agent.post('/api/recruits')
          .send(recruit)
          .expect(400)
          .end(function (recruitSaveErr, recruitSaveRes) {
            // Set message assertion
              (recruitSaveRes.body.message).should.match('Please fill Recruit name');

            // Handle Recruit save error
              done(recruitSaveErr);
          });
      });
    });

    it('should be able to update an Recruit if signed in', function (done) {
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

        // Save a new Recruit
          agent.post('/api/recruits')
          .send(recruit)
          .expect(200)
          .end(function (recruitSaveErr, recruitSaveRes) {
            // Handle Recruit save error
              if (recruitSaveErr) {
                  return done(recruitSaveErr);
              }

            // Update Recruit name
              recruit.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Recruit
              agent.put('/api/recruits/' + recruitSaveRes.body._id)
              .send(recruit)
              .expect(200)
              .end(function (recruitUpdateErr, recruitUpdateRes) {
                // Handle Recruit update error
                  if (recruitUpdateErr) {
                      return done(recruitUpdateErr);
                  }

                // Set assertions
                  (recruitUpdateRes.body._id).should.equal(recruitSaveRes.body._id);
                  (recruitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should be able to get a list of Recruits if not signed in', function (done) {
    // Create new Recruit model instance
        var recruitObj = new Recruit(recruit);

    // Save the recruit
        recruitObj.save(function () {
      // Request Recruits
            request(app).get('/api/recruits')
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
            done();
        });

        });
    });

    it('should be able to get a single Recruit if not signed in', function (done) {
    // Create new Recruit model instance
        var recruitObj = new Recruit(recruit);

    // Save the Recruit
        recruitObj.save(function () {
            request(app).get('/api/recruits/' + recruitObj._id)
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Object).and.have.property('name', recruit.name);

          // Call the assertion callback
            done();
        });
        });
    });

    it('should return proper error for single Recruit with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
        request(app).get('/api/recruits/test')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'Recruit is invalid');

        // Call the assertion callback
          done();
      });
    });

    it('should return proper error for single Recruit which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Recruit
        request(app).get('/api/recruits/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'No Recruit with that identifier has been found');

        // Call the assertion callback
          done();
      });
    });

    it('should be able to delete an Recruit if signed in', function (done) {
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

        // Save a new Recruit
          agent.post('/api/recruits')
          .send(recruit)
          .expect(200)
          .end(function (recruitSaveErr, recruitSaveRes) {
            // Handle Recruit save error
              if (recruitSaveErr) {
                  return done(recruitSaveErr);
              }

            // Delete an existing Recruit
              agent.delete('/api/recruits/' + recruitSaveRes.body._id)
              .send(recruit)
              .expect(200)
              .end(function (recruitDeleteErr, recruitDeleteRes) {
                // Handle recruit error error
                  if (recruitDeleteErr) {
                      return done(recruitDeleteErr);
                  }

                // Set assertions
                  (recruitDeleteRes.body._id).should.equal(recruitSaveRes.body._id);

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to delete an Recruit if not signed in', function (done) {
    // Set Recruit user
        recruit.user = user;

    // Create new Recruit model instance
        var recruitObj = new Recruit(recruit);

    // Save the Recruit
        recruitObj.save(function () {
      // Try deleting Recruit
            request(app).delete('/api/recruits/' + recruitObj._id)
        .expect(403)
        .end(function (recruitDeleteErr, recruitDeleteRes) {
          // Set message assertion
            (recruitDeleteRes.body.message).should.match('User is not authorized');

          // Handle Recruit error error
            done(recruitDeleteErr);
        });

        });
    });

    it('should be able to get a single Recruit that has an orphaned user reference', function (done) {
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

          // Save a new Recruit
            agent.post('/api/recruits')
            .send(recruit)
            .expect(200)
            .end(function (recruitSaveErr, recruitSaveRes) {
              // Handle Recruit save error
                if (recruitSaveErr) {
                    return done(recruitSaveErr);
                }

              // Set assertions on new Recruit
                (recruitSaveRes.body.name).should.equal(recruit.name);
                should.exist(recruitSaveRes.body.user);
                should.equal(recruitSaveRes.body.user._id, orphanId);

              // force the Recruit to have an orphaned user reference
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

                    // Get the Recruit
                      agent.get('/api/recruits/' + recruitSaveRes.body._id)
                      .expect(200)
                      .end(function (recruitInfoErr, recruitInfoRes) {
                        // Handle Recruit error
                          if (recruitInfoErr) {
                              return done(recruitInfoErr);
                          }

                        // Set assertions
                          (recruitInfoRes.body._id).should.equal(recruitSaveRes.body._id);
                          (recruitInfoRes.body.name).should.equal(recruit.name);
                          should.equal(recruitInfoRes.body.user, undefined);

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
            Recruit.remove().exec(done);
        });
    });
});
