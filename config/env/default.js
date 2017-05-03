'use strict';

module.exports = {
    app: {
        AppTitle: '404gaming',
        AppDescription: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
        googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'UA-96461510-1',
        googleRecaptchaPublic: process.env.GOOGLE_RECAPTCHA_PUBLIC || '6LdogRsUAAAAAOZgwgIXB7QTPdjRNgkrOXP2WH0c',
        googleRecaptchaSecret: process.env.GOOGLE_RECAPTCHA_SECRET || '6LdogRsUAAAAAE2YsMw0h65M0lXvytTgubAiLe1F',
        httpsPin:{
            pin1: 'HNkuDDSYoxibVJ0bTCulHKegeK0TqoR8D7S9AmJ/a7M=',
            pin2: 'HNkuDDSYoxibVJ0bTCulHKegeK0TqoR8D7S9AmJ/a7M='
        },
        mongoEncryption:{
            activated: false,
            // It can be defined only ONCE !!
            // Or you have to decrypt all the data before you change this
            SecretKey: 'PdU2vusedclOAV8rQr/tsiUgrIsh6KhWHU9pi9Xa12g='
        }
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    // Session Cookie settings
    sessionCookie: {
        // session expiration is set by default to 48 hours
        maxAge: (8 * (60 * 60 * 1000)) * 2,
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: false,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionSecret should be changed for security measures and concerns
    sessionSecret: process.env.SESSION_SECRET || 'lKC7B+BopgsYJlGeSlOFUWWE4dSxtHNbdVaxdpH2LMA=',
    // sessionKey is set to the generic sessionId key used by PHP applications
    // for obsecurity reasons
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    logo: 'public/img/brand/logo.png',
    favicon: 'public/img/brand/favicon.ico',
    illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
        'unknown', 'anonymous', 'null', 'undefined', 'api','404team','support','404'
    ],
    uploads: {
        profile: {
            image: {
                dest: './modules/users/client/img/profile/uploads/',
                limits: {
                    fileSize: 2 * 1024 * 1024 // Max file size in bytes (1 MB)
                }
            }
        }
    },
    shared: {
        owasp: {
            allowPassphrases: true,
            maxLength: 128,
            minLength: 7,
            minPhraseLength: 20,
            minOptionalTestsToPass: 3
        }
    }
};
