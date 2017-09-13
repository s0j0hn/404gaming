'use strict';

module.exports = {
    secure: {
        ssl: true,
        privateKey: '/etc/letsencrypt/live/www.jansocha.com/privkey.pem',
        certificate: '/etc/letsencrypt/live/www.jansocha.com/cert.pem',
        caBundle: '/etc/letsencrypt/live/www.jansocha.com/chain.pem'
    },
    port: process.env.PORT || 8443,
    // Binding to 127.0.0.1 is safer in production.
    host: process.env.HOST || '0.0.0.0',
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
        options: {
            /**
             * Uncomment to enable ssl certificate based authentication to mongodb
             * servers. Adjust the settings below for your specific certificate
             * setup.
             * for connect to a replicaset, rename server:{...} to replset:{...}

             ssl: true,
             sslValidate: false,
             checkServerIdentity: false,
             sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
             sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
             sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
             sslPass: '1234'

             */
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: process.env.LOG_FORMAT || 'combined',
        fileLogger: {
            directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
            fileName: process.env.LOG_FILE || 'app.log',
            maxsize: 10485760,
            maxFiles: 2,
            json: false
        }
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || '158287341361467',
        clientSecret: process.env.FACEBOOK_SECRET || '5c464537bec9a6442276b4f24139db3f',
        callbackURL: '/api/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/api/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'APP_ID',
        clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || '771fzuw16vnnch',
        clientSecret: process.env.LINKEDIN_SECRET || 'T5E1DrwFw9t1lz0q',
        callbackURL: '/api/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'f88edfa061a93df71ec4',
        clientSecret: process.env.GITHUB_SECRET || 'b2fa65c9a157bb56be976ed44583693f4f6082c2',
        callbackURL: '/api/auth/github/callback'
    },
    stripe: {
        clientID: process.env.STRIPE_ID || 'STRIPE_ID',
        clientSecret: process.env.STRIPE_SECRET || 'STRIPE_SECRET',
        callbackURL: '/api/auth/stripe/callback'
    },
    paypal: {
        clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
        clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
        callbackURL: '/api/auth/paypal/callback',
        sandbox: false
    },
    mailer: {
        from: process.env.MAILER_FROM || '404gamingSupport',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'noreply404gaming@gmail.com',
                pass: process.env.MAILER_PASSWORD || '4o4gaming'
            }
        }
    },
    seedDB: {
        seed: process.env.MONGO_SEED === 'true',
        options: {
            logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
        },
        collections: [{
            model: 'User',
            docs: [{
                data: {
                    username: 'local-admin',
                    email: 'admin@localhost.com',
                    firstName: 'Admin',
                    lastName: 'Local',
                    roles: ['admin', 'user']
                }
            }]
        }]
    }
};
