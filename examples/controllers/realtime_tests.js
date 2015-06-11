require('progenitor.js');

var RequestController = require('../../index').RequestController;

var RealtimeTestsController = RequestController.progeny('RealtimeTestsController', {
  index: function() {},
  create: function() {
    global.RealtimeTestsController$createCalled = this;
  },
  update: function() {
    global.RealtimeTestsController$updatedCalled = this;
  }
});

exports = module.exports = RealtimeTestsController;
