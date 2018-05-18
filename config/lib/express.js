/**
 * Module dependencies.
 */
const config = require('../config');

const express = require('express');
const morgan = require('morgan');
const logger = require('./logger');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const favicon = require('serve-favicon');
const compress = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const flash = require('connect-flash');
const hbs = require('express-hbs');
const path = require('path');
const _ = require('lodash');
const lusca = require('lusca');
const expressWinston = require('express-winston');
const winston = require('winston');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = (app) => {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.twitterUsername = config.twitter.username;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

  // Passing the request url to environment locals
  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = (app) => {
  // Should be placed before express.static
  app.use(compress({
    filter(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9,
  }));

  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = (app) => {
  app.engine('server.view.html', hbs.express4({
    extname: '.server.view.html',
  }));
  app.set('view engine', 'server.view.html');
  app.set('views', path.resolve('./'));
};

/**
 * Configure Express session
 */
module.exports.initSession = (app, db) => {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl,
    },
    name: config.sessionKey,
    store: new MongoStore({
      db,
      collection: config.sessionCollection,
    }),
  }));

  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = (app) => {
  config.files.server.configs.forEach((configPath) => {
    require(path.resolve(configPath))(app);
  });
};

/**
 * Configure Helmet headers configuration for security
 */
module.exports.initHelmetHeaders = (app) => {
  // six months expiration period specified in seconds
  const SIX_MONTHS = 15778476;

  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true,
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = (app) => {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public'), { maxAge: 86400000 }));

  // Globbing static routing
  config.folders.client.forEach((staticPath) => {
    app.use(staticPath, express.static(path.resolve(`./${staticPath}`)));
  });
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = () => {
  // Globbing policy files
  config.files.server.policies.forEach((policyPath) => {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = (app) => {
  // Globbing routing files
  config.files.server.routes.forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = (app) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = (app, db) =>
  // Load the Socket.io configuration
  // Return server object
  require('./socket.io')(app, db);


/**
 * Initialize the Express application
 */
module.exports.init = (db) => {
  // Initialize express app
  let app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app, db);

  return app;
};
