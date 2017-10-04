(function (app) {
  'use strict';

  app.registerModule('app.articles', ['core', 'core.admin']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('app.articles.admin', ['core.admin']);
  app.registerModule('app.articles.services');
  app.registerModule('app.articles.routes', ['ui.router', 'core', 'app.articles.services']);
}(ApplicationConfiguration));
