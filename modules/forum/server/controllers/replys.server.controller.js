'use strict';

/**
 * Module dependencies.
 */
var ipaddr = require('ipaddr.js');
var path = require('path'),
    mongoose = require('mongoose'),
    Reply = mongoose.model('Reply'),
    User = mongoose.model('User'),
    Notification = mongoose.model('Notification'),
    Topic = mongoose.model('Topic'),
    Section = mongoose.model('Section'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');
var icons = Notification.schema.path('icon_class').enumValues;


function createNotification(res, title, description, icon, type, topic, user, sectionId) {
    /*
     'fa-envelope text-warning',
     'fa-ban text-danger',
     'fa-thumbs-o-up text-success',
     'fa-thumbs-o-down text-danger',
     'fa-exclamation-triangle  text-warning',
     'fa-pencil-square-o  text-primary'
     */

    var notification = new Notification();
    notification.user = user;
    notification.name = title;
    notification.description = description;
    notification.icon_class = icon;
    notification.type = type;

    if (type == 'new_reply') {
        notification.link = 'app.forum.sections.topics.view({ topicId: ' + topic._id + ', sectionId: ' + sectionId + '})';
        notification.topic = topic;
        notification.section = sectionId;

    } else if (type == 'new_vote') {
        notification.link = 'app.vote.view({ voteId: ' + topic._id + ' })';
        notification.vote = topic;
    } else {
        notification.vote = null;
        notification.topic = null;
        notification.section = null;
    }

    notification.save(function (err) {
        if (err) {
            res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });
}


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
 * Create a Reply
 */
exports.create = function(req, res) {

    function isTopicBlocked(topicId) {
        Topic.findById(topicId).exec(function (err, topic) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else if (!topic) {
                return res.status(404).send({
                    message: 'No Topic with that identifier has been found'
                });
            }

            return topic.blocked;

        });
    }

    var ip = getIP(req);
    var reply = new Reply(req.body);

    reply.user = req.user;
    var topicId = req.body.topic;
    var sectionId = req.body.section;
    var blocked = isTopicBlocked(topicId);

    if (req.user.roles.indexOf('admin') >= 0 || !blocked) {
        reply.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {


                User.findById(req.user._id, 'username roles created replys posts ip_address').exec(function (err, user) {
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
                    user.replys += 1;
                    user.posts += 1;
                    user.save(function () {

                    });
                });

                Topic.findById(topicId)
                    .populate('user', 'username _id')
                    .populate('section', '_id ')
                    .exec(function (err, topic) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else if (!topic) {
                            return res.status(404).send({
                                message: 'No Topic with that identifier has been found'
                            });
                        }

                        if (topic.user._id != req.user._id) {
                            createNotification(res, 'New Reply', 'on your topic', icons[icons.length - 1], 'new_reply', topic, topic.user, topic.section._id);
                        }

                        topic.replys += 1;
                        topic.save(function(err) {

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
                    section.replys += 1;
                    section.save(function(err) {

                    });
                });

                res.json(reply);
            }
        });
    } else {
        return res.status(422).send({
            message: 'Topic is blocked'
        });
    }
};

/**
 * Show the current Reply
 */
exports.read = function(req, res) {
    res.json(req.reply);
};

/**
 * Update a Reply
 */
exports.update = function(req, res) {
    var reply = req.reply;
    var isCurrentUserOwnerOrAdmin = !!(req.user && reply.user && reply.user._id.toString() === req.user._id.toString() || req.user.roles.indexOf('admin') >= 0);

    reply = _.extend(reply, req.body);

    if (isCurrentUserOwnerOrAdmin) {
        reply.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(reply);
            }
        });
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
    var reply = req.reply;
    var isCurrentUserOwnerOrAdmin = !!(req.user && reply.user && reply.user._id.toString() === req.user._id.toString() || req.user.roles.indexOf('admin') >= 0);

    if (isCurrentUserOwnerOrAdmin) {
        reply.remove(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {

                Topic.findById(reply.topic._id).exec(function (err, topic) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else if (!topic) {
                        return res.status(404).send({
                            message: 'No Section with that identifier has been found'
                        });
                    }

                    if ((topic.replys - 1) >= -1) {
                        topic.replys -= 1;
                    }
                    topic.save(function(err) {

                    });
                });

                User.findById(req.user._id, 'username roles created replys posts ip_address').exec(function (err, user) {
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
                    user.replys -= 1;
                    user.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                    });

                });
                res.json(reply);
            }
        });
    } else {
        return res.status(403).send({
            message: 'User not admin or author'
        });
    }
};

/**
 * List of replys
 */
exports.list = function(req, res) {

    var id = req.query.topicId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Sectionid is invalid'
        });
    }
    if (req.user.roles.indexOf('admin' >= 0)) {
        Reply.find({ 'topic': mongoose.Types.ObjectId(id) }).sort('created')
            .populate('user', 'username roles replys posts profileImageURL created rank ip_address')
            .populate('topic', 'name section')
            .exec(function(err, replys) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(replys);
                }
            });
    } else {
        Reply.find({ 'topic': mongoose.Types.ObjectId(id) }).sort('created')
            .populate('user', 'username roles replys posts profileImageURL created rank')
            .populate('topic', 'name section')
            .exec(function(err, replys) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(replys);
                }
            });
    }
};

/**
 * Reply middleware
 */
exports.replyByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Reply is invalid'
        });
    }

    if (req.user.roles.indexOf('admin' >= 0)) {
        Reply.findById(id)
            .populate('user', 'username roles replys profileImageURL created rank ip_address')
            .populate('topic', 'name ')
            .exec(function (err, reply) {
                if (err) {
                    return next(err);
                } else if (!reply) {
                    return res.status(404).send({
                        message: 'No Reply with that identifier has been found'
                    });
                }

                req.reply = reply;
                next();

            });
    } else {
        Reply.findById(id)
            .populate('user', 'username roles replys profileImageURL created rank')
            .populate('topic', 'name ')
            .exec(function (err, reply) {
                if (err) {
                    return next(err);
                } else if (!reply) {
                    return res.status(404).send({
                        message: 'No Reply with that identifier has been found'
                    });
                }

                req.reply = reply;
                next();

            });
    }
};
