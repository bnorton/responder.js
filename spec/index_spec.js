require('./helpers/spec_helper.js');

describe('responder.js', function() {
  var index = require('../index'),
    requestController = index.RequestController,
    realtimeController = index.RealtimeController,
    routing = index.Routing,
    responder = index.Responder;

  it('should have the request controller', function() {
    expect(requestController.className).toBe('RequestController');
  });

  it('should have the realtime controller', function() {
    expect(realtimeController.className).toBe('RealtimeController');
  });

  it('should have outing', function() {
    expect(routing.className).toBe('Routing');
  });

  it('should have the responder', function() {
    expect(typeof responder).toBe('function');
  });
});
