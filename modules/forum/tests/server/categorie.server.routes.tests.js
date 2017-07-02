'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Categorie = mongoose.model('Categorie'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    categorie;

/**
 * Categorie routes tests
 */
describe('Categorie CRUD tests', function () {

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

    // Save a user to the test db and create new Categorie
        user.save(function () {
            categorie = {
                name: 'Categorie name'
            };

            done();
        });
    });

    it('should be able to save a Categorie if logged in', function (done) {
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

        // Save a new Categorie
          agent.post('/api/categories')
          .send(categorie)
          .expect(200)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Handle Categorie save error
              if (categorieSaveErr) {
                  return done(categorieSaveErr);
              }

            // Get a list of Categories
              agent.get('/api/categories')
              .end(function (categoriesGetErr, categoriesGetRes) {
                // Handle Categories save error
                  if (categoriesGetErr) {
                      return done(categoriesGetErr);
                  }

                // Get Categories list
                  var categories = categoriesGetRes.body;

                // Set assertions
                  (categories[0].user._id).should.equal(userId);
                  (categories[0].name).should.match('Categorie name');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to save an Categorie if not logged in', function (done) {
        agent.post('/api/categories')
      .send(categorie)
      .expect(403)
      .end(function (categorieSaveErr, categorieSaveRes) {
        // Call the assertion callback
          done(categorieSaveErr);
      });
    });

    it('should not be able to save an Categorie if no name is provided', function (done) {
    // Invalidate name field
        categorie.name = '';

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

        // Save a new Categorie
          agent.post('/api/categories')
          .send(categorie)
          .expect(400)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Set message assertion
              (categorieSaveRes.body.message).should.match('Please fill Categorie name');

            // Handle Categorie save error
              done(categorieSaveErr);
          });
      });
    });

    it('should be able to update an Categorie if signed in', function (done) {
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

        // Save a new Categorie
          agent.post('/api/categories')
          .send(categorie)
          .expect(200)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Handle Categorie save error
              if (categorieSaveErr) {
                  return done(categorieSaveErr);
              }

            // Update Categorie name
              categorie.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Categorie
              agent.put('/api/categories/' + categorieSaveRes.body._id)
              .send(categorie)
              .expect(200)
              .end(function (categorieUpdateErr, categorieUpdateRes) {
                // Handle Categorie update error
                  if (categorieUpdateErr) {
                      return done(categorieUpdateErr);
                  }

                // Set assertions
                  (categorieUpdateRes.body._id).should.equal(categorieSaveRes.body._id);
                  (categorieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should be able to get a list of Categories if not signed in', function (done) {
    // Create new Categorie model instance
        var categorieObj = new Categorie(categorie);

    // Save the categorie
        categorieObj.save(function () {
      // Request Categories
            request(app).get('/api/categories')
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
            done();
        });

        });
    });

    it('should be able to get a single Categorie if not signed in', function (done) {
    // Create new Categorie model instance
        var categorieObj = new Categorie(categorie);

    // Save the Categorie
        categorieObj.save(function () {
            request(app).get('/api/categories/' + categorieObj._id)
        .end(function (req, res) {
          // Set assertion
            res.body.should.be.instanceof(Object).and.have.property('name', categorie.name);

          // Call the assertion callback
            done();
        });
        });
    });

    it('should return proper error for single Categorie with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
        request(app).get('/api/categories/test')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'Categorie is invalid');

        // Call the assertion callback
          done();
      });
    });

    it('should return proper error for single Categorie which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Categorie
        request(app).get('/api/categories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'No Categorie with that identifier has been found');

        // Call the assertion callback
          done();
      });
    });

    it('should be able to delete an Categorie if signed in', function (done) {
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

        // Save a new Categorie
          agent.post('/api/categories')
          .send(categorie)
          .expect(200)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Handle Categorie save error
              if (categorieSaveErr) {
                  return done(categorieSaveErr);
              }

            // Delete an existing Categorie
              agent.delete('/api/categories/' + categorieSaveRes.body._id)
              .send(categorie)
              .expect(200)
              .end(function (categorieDeleteErr, categorieDeleteRes) {
                // Handle categorie error error
                  if (categorieDeleteErr) {
                      return done(categorieDeleteErr);
                  }

                // Set assertions
                  (categorieDeleteRes.body._id).should.equal(categorieSaveRes.body._id);

                // Call the assertion callback
                  done();
              });
          });
      });
    });

    it('should not be able to delete an Categorie if not signed in', function (done) {
    // Set Categorie user
        categorie.user = user;

    // Create new Categorie model instance
        var categorieObj = new Categorie(categorie);

    // Save the Categorie
        categorieObj.save(function () {
      // Try deleting Categorie
            request(app).delete('/api/categories/' + categorieObj._id)
        .expect(403)
        .end(function (categorieDeleteErr, categorieDeleteRes) {
          // Set message assertion
            (categorieDeleteRes.body.message).should.match('User is not authorized');

          // Handle Categorie error error
            done(categorieDeleteErr);
        });

        });
    });

    it('should be able to get a single Categorie that has an orphaned user reference', function (done) {
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

          // Save a new Categorie
            agent.post('/api/categories')
            .send(categorie)
            .expect(200)
            .end(function (categorieSaveErr, categorieSaveRes) {
              // Handle Categorie save error
                if (categorieSaveErr) {
                    return done(categorieSaveErr);
                }

              // Set assertions on new Categorie
                (categorieSaveRes.body.name).should.equal(categorie.name);
                should.exist(categorieSaveRes.body.user);
                should.equal(categorieSaveRes.body.user._id, orphanId);

              // force the Categorie to have an orphaned user reference
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

                    // Get the Categorie
                      agent.get('/api/categories/' + categorieSaveRes.body._id)
                      .expect(200)
                      .end(function (categorieInfoErr, categorieInfoRes) {
                        // Handle Categorie error
                          if (categorieInfoErr) {
                              return done(categorieInfoErr);
                          }

                        // Set assertions
                          (categorieInfoRes.body._id).should.equal(categorieSaveRes.body._id);
                          (categorieInfoRes.body.name).should.equal(categorie.name);
                          should.equal(categorieInfoRes.body.user, undefined);

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
            Categorie.remove().exec(done);
        });
    });
});
