(function (app) {
  'use strict';

  app.registerModule('app.users', ['ui.router', 'core']);
  app.registerModule('app.users.admin', ['core.admin']);
  app.registerModule('app.users.admin.routes', ['core.admin.routes']);
}(ApplicationConfiguration));
