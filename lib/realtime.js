require('progenitor.js')();

var extend = require('extend');

var RealtimeController = Object.progeny('RealtimeController', {
  init: function(req, res, options) {
    options || (options = {});

    this.request = req;
    this.params = extend({}, JSON.parse(req.body), options);
  }, requireParams: function() {
    var that = this,
      names = Array.prototype.slice.call(arguments),
      missingParams = [];

    names.forEach(function(name) {
      if (!that.params[name]) {
        missingParams.push(name);
      }
    });

    return missingParams.length ? missingParams : null;
  }, joinRoom: function() {
    return this.request.io.join(Array.prototype.slice.call(arguments).join(':'));
  }, findRoom: function() {
    return this.request.io.to(Array.prototype.slice.call(arguments).join(':'))
  }
});

exports = module.exports = RealtimeController;
