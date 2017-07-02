'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Section = mongoose.model('Section'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    section;

/**
 * Section routes tests
 */
describe('Section CRUD tests', function () {

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

    // Save a user to the test db and create new Section
        user.save(function () {
            section = {
                name: 'Section name'
            };

            done();
        });
    });

    it('should be able to save a Section if logged in', function (done) {
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

        // Save a new Section
          agent.post('/api/sections')
          .send(section)
          .expect(200)
          .end(function (sectionSaveErr, sectionSaveRes) {
            // Handle Section save error
              if (sectionSaveErr) {
                  return done(sectionSaveErr);
              }

            // Get a list of Sections
              agent.get('/api/sections')
              .end(function (sectionsGetErr, sectionsGetRes) {
                // Handle Sections save error
                  if (sectionsGetErr) {
                      return done(sectionsGetErr);
                  }

                // Get Sections list
                  var sections = sectionsGetRes.body;

                // Set assertions
                  (sections[0].user._id).should.equal(userId);
                  (sections[0].name).should.match('Section name');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to save an Section if not logged in', function (done) {
        agent.post('/api/sections')
      .send(section)
      .expect(403)
      .end(function (sectionSaveErr, sectionSaveRes) {
        // Call the assertion callback
          done(sectionSaveErr);
      });
    });

    it('should not be able to save an Section if no name is provided', function (done) {
    // Invalidate name field
        section.name = '';

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

        // Save a new Section
          agent.post('/api/sections')
          .send(section)
          .expect(400)
          .end(function (sectionSaveErr, sectionSaveRes) {
            // Set message assertion
              (sectionSaveRes.body.message).should.match('Please fill Section name');

            // Handle Section save error
              done(sectionSaveErr);
          });
      });
    });

    it('should be able to update an Section if signed in', function (done) {
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

        // Save a new Section
          agent.post('/api/sections')
          .send(section)
          .expect(200)
          .end(function (sectionSaveErr, sectionSaveRes) {
            // Handle Section save error
              if (sectionSaveErr) {
                  return done(sectionSaveErr);
              }

            // Update Section name
              section.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Section
              agent.put('/api/sections/' + sectionSaveRes.body._id)
              .send(section)
              .expect(200)
              .end(function (sectionUpdateErr, sectionUpdateRes) {
                // Handle Section update error
                  if (sectionUpdateErr) {
                      return done(sectionUpdateErr);
                  }

                // Set assertions
                  (sectionUpdateRes.body._id).should.equal(sectionSaveRes.body._id);
                  (sectionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should be able to get a list of Sections if not signed in', function (done) {
    // Create new Section model instance
        var sectionObj = new Section(section);

    // Save the section
        sectionObj.save(function () {
      // Request Sections
            request(app).get('/api/sections')
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
            done();
        });

        });
    });

    it('should be able to get a single Section if not signed in', function (done) {
    // Create new Section model instance
        var sectionObj = new Section(section);

    // Save the Section
        sectionObj.save(function () {
            request(app).get('/api/sections/' + sectionObj._id)
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Object).and.have.property('name', section.name);

          // Call the assertion callback
            done();
        });
        });
    });

    it('should return proper error for single Section with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
        request(app).get('/api/sections/test')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'Section is invalid');

        // Call the assertion callback
          done();
      });
    });

    it('should return proper error for single Section which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Section
        request(app).get('/api/sections/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'No Section with that identifier has been found');

        // Call the assertion callback
          done();
      });
    });

    it('should be able to delete an Section if signed in', function (done) {
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

        // Save a new Section
          agent.post('/api/sections')
          .send(section)
          .expect(200)
          .end(function (sectionSaveErr, sectionSaveRes) {
            // Handle Section save error
              if (sectionSaveErr) {
                  return done(sectionSaveErr);
              }

            // Delete an existing Section
              agent.delete('/api/sections/' + sectionSaveRes.body._id)
              .send(section)
              .expect(200)
              .end(function (sectionDeleteErr, sectionDeleteRes) {
                // Handle section error error
                  if (sectionDeleteErr) {
                      return done(sectionDeleteErr);
                  }

                // Set assertions
                  (sectionDeleteRes.body._id).should.equal(sectionSaveRes.body._id);

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to delete an Section if not signed in', function (done) {
    // Set Section user
        section.user = user;

    // Create new Section model instance
        var sectionObj = new Section(section);

    // Save the Section
        sectionObj.save(function () {
      // Try deleting Section
            request(app).delete('/api/sections/' + sectionObj._id)
        .expect(403)
        .end(function (sectionDeleteErr, sectionDeleteRes) {
          // Set message assertion
            (sectionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Section error error
            done(sectionDeleteErr);
        });

        });
    });

    it('should be able to get a single Section that has an orphaned user reference', function (done) {
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

          // Save a new Section
            agent.post('/api/sections')
            .send(section)
            .expect(200)
            .end(function (sectionSaveErr, sectionSaveRes) {
              // Handle Section save error
                if (sectionSaveErr) {
                    return done(sectionSaveErr);
                }

              // Set assertions on new Section
                (sectionSaveRes.body.name).should.equal(section.name);
                should.exist(sectionSaveRes.body.user);
                should.equal(sectionSaveRes.body.user._id, orphanId);

              // force the Section to have an orphaned user reference
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

                    // Get the Section
                      agent.get('/api/sections/' + sectionSaveRes.body._id)
                      .expect(200)
                      .end(function (sectionInfoErr, sectionInfoRes) {
                        // Handle Section error
                          if (sectionInfoErr) {
                              return done(sectionInfoErr);
                          }

                        // Set assertions
                          (sectionInfoRes.body._id).should.equal(sectionSaveRes.body._id);
                          (sectionInfoRes.body.name).should.equal(section.name);
                          should.equal(sectionInfoRes.body.user, undefined);

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
            Section.remove().exec(done);
        });
    });
});
