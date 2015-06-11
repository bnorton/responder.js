var RequestController = require('../../index').RequestController;

var ChannelsController = RequestController.progeny('ChannelsController', {
  index: function() {},
  create: function() {},
  show: function() {},
  update: function() {},
  destroy: function() {}
}) ;

exports = module.exports = ChannelsController;
