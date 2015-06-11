require('progenitor.js')();

var underscored = require('./underscored'),
  cache = {};

var Responder = function(klass, method) {
  var key = [klass.className, method].join(':'),
    factory = cache[key];

  if(!factory) {
    cache[key] = factory = {
      run: function(req, res) {
        var instance = new klass(req, res, { action: method });

        instance.params.controller = underscored(instance.className);

        instance[method].call(instance);
        return instance;
      }
    };
  }

  return factory;
};

exports = module.exports = Responder;
