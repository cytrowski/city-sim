var app = require('koa')(),
    router = require('app/router');

app
  .use(require('app/middlewares/setXResponseTime'))
  .use(require('app/middlewares/log'))
  .use(require('app/middlewares/fixCorsIssues'))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || 5000);
