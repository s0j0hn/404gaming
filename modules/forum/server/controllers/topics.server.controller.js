'use strict';

/**
 * Module dependencies.
 */
var ipaddr = require('ipaddr.js');
var path = require('path'),
    mongoose = require('mongoose'),
    Topic = mongoose.model('Topic'),
    User = mongoose.model('User'),
    Section = mongoose.model('Section'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

function getIP(req) {
    var ipString = (req.headers['X-Forwarded-For'] ||
        req.headers['x-forwarded-for'] ||
        '').split(',')[0] ||
        req.connection.remoteAddress;

    if (ipaddr.isValid(ipString)) {
        try {
            var addr = ipaddr.parse(ipString);
            if (ipaddr.IPv6.isValid(ipString) && addr.isIPv4MappedAddress()) {
                return addr.toIPv4Address().toString();
            }
            return addr.toNormalizedString();
        } catch (e) {
            return ipString;
        }
    }
    return 'unknown';
}
/**
 * Create a Topic
 */
exports.create = function(req, res) {
    var topic = new Topic(req.body);
    var ip = getIP(req);
    topic.user = req.user;

    var sectionId = req.body.section;

    topic.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!mongoose.Types.ObjectId.isValid(sectionId)) {
                return res.status(400).send({
                    message: 'Section is invalid'
                });
            }

            User.findById(req.user._id, 'username roles created posts ip_address').exec(function (err, user) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else if (!user) {
                    return res.status(400).send({
                        message: 'failed to load user'
                    });
                }
                for (var i = 0; i < user.ip_address.length; i++) {
                    if (user.ip_address[i] == ip) {
                        user.ip_address[i] = ip;
                        break;
                    }
                }
                user.posts += 1;
                user.save(function () {

                });

            });

            Section.findById(sectionId).exec(function (err, section) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else if (!section) {
                    return res.status(404).send({
                        message: 'No Section with that identifier has been found'
                    });
                }
                section.latestPost = topic._id;
                section.posts += 1;
                section.save(function(err) {

                });
            });
            res.json(topic);
        }
    });

};

/**
 * Show the current Reply
 */
exports.read = function(req, res) {
    res.json(req.topic);
};

/**
 * Update a Reply
 */
exports.update = function(req, res) {
    var topic = req.topic;

    var isCurrentUserOwnerOrAdmin = !!(req.user && topic.user && topic.user._id.toString() === req.user._id.toString() || req.user.roles.indexOf('admin') >= 0);

    topic = _.extend(topic, req.body);
    var oldSectionId = topic.oldSectionId;

    if (isCurrentUserOwnerOrAdmin) {
        if (topic.moved) {
            if (!mongoose.Types.ObjectId.isValid(oldSectionId)) {
                return res.status(400).send({
                    message: 'Section old is invalid'
                });
            }
            Section.findById(oldSectionId).exec(function (err, section) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else if (!section) {
                    return res.status(404).send({
                        message: 'No Section old with that identifier has been found'
                    });
                }

                section.latestPost = null;
                if ((section.posts - 1) >= -1) {
                    section.posts -= 1;
                    section.replys -= topic.replys;
                }

                section.save(function(err) {

                });
            });


            topic.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    Section.findById(topic.section._id).exec(function (err, section) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else if (!section) {
                            return res.status(404).send({
                                message: 'No Section with that identifier has been found'
                            });
                        }
                        section.latestPost = topic._id;
                        section.posts += 1;
                        section.replys += topic.replys;
                        section.save(function(err) {

                        });
                    });
                    res.json(topic);
                }
            });
        } else {
            topic.updated = Date.now();
            topic.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(topic);
                }
            });
        }
    } else {
        return res.status(403).send({
            message: 'User not admin or author'
        });
    }

};

/**
 * Delete an Reply
 */
exports.delete = function(req, res) {
    var ip = getIP(req);
    var topic = req.topic;
    var isCurrentUserOwnerOrAdmin = !!(req.user && topic.user && topic.user._id.toString() === req.user._id.toString() || req.user.roles.indexOf('admin') >= 0);

    if (isCurrentUserOwnerOrAdmin) {
        topic.remove(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                Section.findById(topic.section._id).exec(function (err, section) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else if (!section) {
                        return res.status(404).send({
                            message: 'No Section with that identifier has been found'
                        });
                    }
                    section.latestPost = null;
                    if ((section.posts - 1) >= -1) {
                        section.posts -= 1;
                        section.replys -= topic.replys;
                    }
                    section.save(function(err) {

                    });
                });

                User.findById(req.user._id, 'username roles created posts ip_address').exec(function (err, user) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else if (!user) {
                        return res.status(400).send({
                            message: 'failed to load user'
                        });
                    }
                    for (var i = 0; i < user.ip_address.length; i++) {
                        if (user.ip_address[i] == ip) {
                            user.ip_address[i] = ip;
                            break;
                        }
                    }
                    user.posts -= 1;
                    user.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                    });

                });
                res.json(topic);
            }
        });
    } else {
        return res.status(403).send({
            message: 'User not admin or author'
        });
    }
};

/**
 * List of Topics
 */
exports.list = function(req, res) {

    var id = req.query.sectionId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Sectionid is invalid'
        });
    }
    var select = null;
    if (req.user.roles.indexOf('admin') >= 0) {
        select = 'username roles posts profileImageURL created rank ip_address';
    } else {
        select = 'username roles posts profileImageURL created rank';
    }
    Topic.find({ 'section': mongoose.Types.ObjectId(id) }).sort('-created')
        .populate('user', select)
        .populate('section', 'name visibility')
        .exec(function(err, topics) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(topics);
            }
        });
};

/**
 * Reply middleware
 */
exports.topicByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Reply is invalid'
        });
    }

    var select = null;
    if (req.user.roles.indexOf('admin') >= 0) {
        select = 'username roles posts profileImageURL created rank ip_address';
    } else {
        select = 'username roles posts profileImageURL created rank';
    }

    Topic.findById(id)
        .populate('user', select)
        .populate('section', 'name visibility')
        .exec(function (err, topic) {
            if (err) {
                return next(err);
            } else if (!topic) {
                return res.status(404).send({
                    message: 'No Reply with that identifier has been found'
                });
            }
            if (req.user.roles.indexOf(topic.section.visibility) >= 0 || req.user.roles.indexOf('admin') >= 0) {
                if (topic.user !== null && topic.user._id !== req.user._id) {
                    topic.views += 1;
                    topic.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                    });
                }

                req.topic = topic;
                next();
            } else {
                return res.status(403).send({
                    message: 'Forbidden'
                });
            }

        });
};
