require('progenitor.js')();

var methodsByType = {
  index: ['get'],
  create: ['post'],
  show: ['get'],
  update: ['put', 'patch'],
  destroy: ['delete']
};

var callSafe = require('./safe'),
  cwd = process.cwd(),
  realtimeRoutes = {},
  Responder;

var Routing = Object.progeny('Routing', {
}, {
  classMethods: {
    resources: function(name, options) {
      options || (options = {});
      options.only || (options.only = []);

      var klass = findController(name);

      Responder || (Responder = require('../index').Responder);

      options.only.forEach(function(type) {
        var matcher = null;

        switch(type) {
          case 'index':
          case 'create':
            matcher = '/'+name;
            break;
          case 'show':
          case 'update':
          case 'destroy':
            matcher = '/'+name+'/:id';
            break;
        }

        if(!matcher || ! methodsByType[type])
          throw new Error('Routes of type: '+type+', are net yet supported.');

        methodsByType[type].forEach(function(name) {
          var runner = new Responder(klass, type).run;

          if(!klass.prototype[type])
            throw new Error('Expected '+klass.className+' to define the action `'+type+'`');

          [matcher+'.json', matcher].forEach(function(m) { app[name](m, runner); });
        });
      });
    }, realtime: function(name, options) {
      options || (options = {});
      options.only || (options.only = ['create']);

      var klass = findController(name);

      options.only.forEach(function(type) {
        var key = [name, type].join(':');

        realtimeRoutes[key] = new Responder(klass, type).run;
      });
    },
    done: function() {
      io.on('connection', function(socket) {
        Object.keys(realtimeRoutes).forEach(function(route) {
          var runner = realtimeRoutes[route];

          socket.on(route, function(data) {
            runner.call(global, { body: data, io: socket });
          });
        });
      });
    }
  }
});

function findController(name) {
  var klass = null;

  callSafe(function() { klass = require([cwd, 'controllers', name+'.js'].join('/')) });
  !klass && callSafe(function() { klass = require([cwd, 'examples', 'controllers', name+'.js'].join('/')) });

  if(!klass)
    throw new Error('Expected ' + name + ' to be available in APP_ROOT/controllers');

  return klass;
}

exports = module.exports = Routing;
