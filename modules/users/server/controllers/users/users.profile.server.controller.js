/**
 * Module dependencies
 */
const _ = require('lodash');

const fs = require('fs');
const path = require('path');

const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const mongoose = require('mongoose');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const amazonS3URI = require('amazon-s3-uri');

const config = require(path.resolve('./config/config'));
const User = mongoose.model('User');
const validator = require('validator');
const UserRepository = require('../../repositories/user.repository');

const ApiError = require(path.resolve('./config/helpers/ApiError'));

const whitelistedFields = ['firstName', 'lastName', 'email', 'username'];

const useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
let s3;

if (useS3Storage) {
  aws.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey,
  });

  s3 = new aws.S3();
}

/**
 * Update user details
 */
exports.update = async (req, res, next) => {
  let user = {};
  try {
    user = await UserRepository.getById(req.user.id);
  } catch (err) {
    return next(new ApiError(err.message));
  }

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updated = Date.now();
    user.displayName = `${user.firstName} ${user.lastName}`;

    user.save((err) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err),
        });
      }
      req.login(user, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in',
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = (req, res) => {
  const user = req.user;
  let existingImageUrl;
  let multerConfig;


  if (useS3Storage) {
    multerConfig = {
      storage: multerS3({
        s3,
        bucket: config.aws.s3.bucket,
        acl: 'public-read',
      }),
    };
  } else {
    multerConfig = config.uploads.profile.image;
  }

  // Filtering to upload only images
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

  const upload = multer(multerConfig).single('newProfilePicture');

  function uploadImage() {
    return new Promise((resolve, reject) => {
      upload(req, res, (uploadError) => {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateUser() {
    return new Promise((resolve, reject) => {
      user.profileImageURL = config.uploads.storage === 's3' && config.aws.s3 ?
        req.file.location :
        `/${req.file.path}`;
      user.save((err, theuser) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise((resolve, reject) => {
      if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
        if (useS3Storage) {
          try {
            const { region, bucket, key } = amazonS3URI(existingImageUrl);
            const params = {
              Bucket: config.aws.s3.bucket,
              Key: key,
            };

            s3.deleteObject(params, (err) => {
              if (err) {
                console.log('Error occurred while deleting old profile picture.');
                console.log(`Check if you have sufficient permissions : ${err}`);
              }

              resolve();
            });
          } catch (err) {
            console.warn(`${existingImageUrl} is not a valid S3 uri`);

            return resolve();
          }
        } else {
          fs.unlink(path.resolve(`.${existingImageUrl}`), (unlinkError) => {
            if (unlinkError) {
              // If file didn't exist, no need to reject promise
              if (unlinkError.code === 'ENOENT') {
                console.log('Removing profile image failed because file did not exist.');
                return resolve();
              }

              console.error(unlinkError);

              reject(new Error('Error occurred while deleting old profile picture'));
            } else {
              resolve();
            }
          });
        }
      } else {
        resolve();
      }
    });
  }

  function login() {
    return new Promise((resolve) => {
      req.login(user, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(() => {
        res.json(user);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in',
    });
  }
};

/**
 * Send User
 */
exports.me = (req, res) => {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  let safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData,
    };
  }

  res.json(safeUserObject || null);
};
