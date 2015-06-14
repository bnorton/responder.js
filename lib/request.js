require('progenitor.js')();

var extend = require('extend'),
  underscored = require('./underscored'),
  responseCodes = { create: 201 };

var RequestController = Object.progeny('RequestController', {
  init: function(req, res, options) {
    this.request = req;
    this.response = res;
    this.params = extend({}, (req.body || {}), (req.params || {}), options);

    this.sendJSON = this.sendJSON.bind(this);
    this.send200 = this.send200.bind(this);
    this.send201 = this.send201.bind(this);
    this.send302 = this.send302.bind(this);
    this.send401 = this.send401.bind(this);
    this.send404 = this.send404.bind(this);
    this.send422 = this.send422.bind(this);
    this.send500 = this.send500.bind(this);
  },
  sendJSON: (sendJSON = function() {
    var status = responseCodes[this.params.action] || 200,
      json = { status: status, meta: {} },
      models = [this.model];

    models = models.concat.apply(models, arguments);

    models.forEach(function(model) {
      if(!model) return;

      var name = model.className;

      if(model.modelClass) {
        name = model.modelClass.className + 's';
      }

      json[underscored(name)] = model.asJSON();
    });

    this.response.status(status);
    this.response.json(json);
  }),
  send200: sendJSON,
  send201: sendJSON,
  send302: function(to) { return this.response.redirect(302, to); },
  send401: function(message) { return sendGenericError.call(this, 401, message || 'Authentication error'); },
  send404: function(message) { return sendGenericError.call(this, 404, message || 'Resource not found'); },
  send422: function(message) { return sendGenericError.call(this, 422, message || 'Unprocessable request' ); },
  send500: function(message) { return sendGenericError.call(this, 500, message || 'Server error' ); }
});

function sendGenericError(code, message) {
  var json = { code: code, meta: { }, error: { message: message }};

  this.response.status(code);
  this.response.json(json);
}

exports = module.exports = RequestController;
