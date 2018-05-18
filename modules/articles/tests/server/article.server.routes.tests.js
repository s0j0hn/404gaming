const should = require('should');
const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Article = mongoose.model('Article');
const express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
let app;

let agent;
let credentials;
let user;
let article;

/**
 * Article routes tests
 */
describe('Article CRUD tests', () => {
  before((done) => {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach((done) => {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local',
    });

    // Save a user to the test db and create new article
    user.save()
      .then(() => {
        article = {
          title: 'Article Title',
          content: 'Article Content',
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an article if logged in without the "admin" role', (done) => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(article)
          .expect(403)
          .end((articleSaveErr, articleSaveRes) => {
            // Call the assertion callback
            done(articleSaveErr);
          });
      });
  });

  it('should not be able to save an article if not logged in', (done) => {
    agent.post('/api/articles')
      .send(article)
      .expect(403)
      .end((articleSaveErr, articleSaveRes) => {
        // Call the assertion callback
        done(articleSaveErr);
      });
  });

  it('should not be able to update an article if signed in without the "admin" role', (done) => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(article)
          .expect(403)
          .end((articleSaveErr, articleSaveRes) => {
            // Call the assertion callback
            done(articleSaveErr);
          });
      });
  });

  it('should be able to get a list of articles if not signed in', (done) => {
    // Create new article model instance
    const articleObj = new Article(article);

    // Save the article
    articleObj.save(() => {
      // Request articles
      agent.get('/api/articles')
        .end((req, res) => {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get a single article if not signed in', (done) => {
    // Create new article model instance
    const articleObj = new Article(article);

    // Save the article
    articleObj.save(() => {
      agent.get(`/api/articles/${articleObj._id}`)
        .end((req, res) => {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', article.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single article with an invalid Id, if not signed in', (done) => {
    // test is not a valid mongoose Id
    agent.get('/api/articles/test')
      .end((req, res) => {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Article is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single article which doesnt exist, if not signed in', (done) => {
    // This is a valid mongoose Id but a non-existent article
    agent.get('/api/articles/559e9cd815f80b4c256a8f41')
      .end((req, res) => {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No article with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an article if signed in without the "admin" role', (done) => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(article)
          .expect(403)
          .end((articleSaveErr, articleSaveRes) => {
            // Call the assertion callback
            done(articleSaveErr);
          });
      });
  });

  it('should not be able to delete an article if not signed in', (done) => {
    // Set article user
    article.user = user;

    // Create new article model instance
    const articleObj = new Article(article);

    // Save the article
    articleObj.save(() => {
      // Try deleting article
      agent.delete(`/api/articles/${articleObj._id}`)
        .expect(403)
        .end((articleDeleteErr, articleDeleteRes) => {
          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not authorized');

          // Handle article error error
          done(articleDeleteErr);
        });
    });
  });

  it('should be able to get a single article that has an orphaned user reference', (done) => {
    // Create orphan user creds
    const _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3',
    };

    // Create orphan user
    const _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin'],
    });

    _orphan.save((err, orphan) => {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          const orphanId = orphan._id;

          // Save a new article
          agent.post('/api/articles')
            .send(article)
            .expect(200)
            .end((articleSaveErr, articleSaveRes) => {
              // Handle article save error
              if (articleSaveErr) {
                return done(articleSaveErr);
              }

              // Set assertions on new article
              (articleSaveRes.body.title).should.equal(article.title);
              should.exist(articleSaveRes.body.user);
              should.equal(articleSaveRes.body.user._id, orphanId);

              // force the article to have an orphaned user reference
              orphan.remove(() => {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end((err, res) => {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the article
                    agent.get(`/api/articles/${articleSaveRes.body._id}`)
                      .expect(200)
                      .end((articleInfoErr, articleInfoRes) => {
                        // Handle article error
                        if (articleInfoErr) {
                          return done(articleInfoErr);
                        }

                        // Set assertions
                        (articleInfoRes.body._id).should.equal(articleSaveRes.body._id);
                        (articleInfoRes.body.title).should.equal(article.title);
                        should.equal(articleInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single article if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', (done) => {
    // Create new article model instance
    const articleObj = new Article(article);

    // Save the article
    articleObj.save((err) => {
      if (err) {
        return done(err);
      }
      agent.get(`/api/articles/${articleObj._id}`)
        .end((req, res) => {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', article.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single article, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', (done) => {
    // Create temporary user creds
    const _creds = {
      usernameOrEmail: 'articleowner',
      password: 'M3@n.jsI$Aw3$0m3',
    };

    // Create user that will create the Article
    const _articleOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user'],
    });

    _articleOwner.save((err, _user) => {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Article
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          const userId = _user._id;

          // Save a new article
          agent.post('/api/articles')
            .send(article)
            .expect(200)
            .end((articleSaveErr, articleSaveRes) => {
              // Handle article save error
              if (articleSaveErr) {
                return done(articleSaveErr);
              }

              // Set assertions on new article
              (articleSaveRes.body.title).should.equal(article.title);
              should.exist(articleSaveRes.body.user);
              should.equal(articleSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end((err, res) => {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the article
                  agent.get(`/api/articles/${articleSaveRes.body._id}`)
                    .expect(200)
                    .end((articleInfoErr, articleInfoRes) => {
                      // Handle article error
                      if (articleInfoErr) {
                        return done(articleInfoErr);
                      }

                      // Set assertions
                      (articleInfoRes.body._id).should.equal(articleSaveRes.body._id);
                      (articleInfoRes.body.title).should.equal(article.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (articleInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach((done) => {
    Article.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
