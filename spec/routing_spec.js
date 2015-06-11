require('./helpers/spec_helper.js');

var Routing = require('../index').Routing;
  Responder = require('../index').Responder;

describe(Routing.className, function() {
  describe('.resources', function() {
    var name, only, app, resources = function() {
      Routing.resources(name, { only: only });
    }, ChannelsController = require('../examples/controllers/channels');

    beforeEach(function() {
      name = 'channels';
      only = [];
      global.app = app = jasmine.createSpyObj('express.js', ['get', 'post', 'put', 'patch', 'delete']);
    });

    it('should not add routes', function() {
      resources();

      expect(app.get).not.toHaveBeenCalled();
      expect(app.post).not.toHaveBeenCalled();
      expect(app.put).not.toHaveBeenCalled();
      expect(app.patch).not.toHaveBeenCalled();
      expect(app.delete).not.toHaveBeenCalled();
    });

    describe('#index', function() {
      beforeEach(function() {
        only = ['index'];

        resources();
      });

      it('should add the index route', function() {
        var runner = new Responder(ChannelsController, 'index').run;

        expect(app.get).toHaveBeenCalledWith('/channels', runner);
        expect(app.get).toHaveBeenCalledWith('/channels.json', runner);
      });
    });

    describe('#create', function() {
      beforeEach(function() {
        only = ['create'];

        resources();
      });

      it('should add the create route', function() {
        var runner = new Responder(ChannelsController, 'create').run;

        expect(app.post).toHaveBeenCalledWith('/channels', runner);
        expect(app.post).toHaveBeenCalledWith('/channels.json', runner);
      });
    });

    describe('#show', function() {
      beforeEach(function() {
        only = ['show'];

        resources();
      });

      it('should add the show route', function() {
        var runner = new Responder(ChannelsController, 'show').run;

        expect(app.get).toHaveBeenCalledWith('/channels/:id', runner);
        expect(app.get).toHaveBeenCalledWith('/channels/:id.json', runner);
      });
    });

    describe('#update', function() {
      beforeEach(function() {
        only = ['update'];

        resources();
      });

      it('should add the update route', function() {
        var runner = new Responder(ChannelsController, 'update').run;

        expect(app.put).toHaveBeenCalledWith('/channels/:id', runner);
        expect(app.put).toHaveBeenCalledWith('/channels/:id.json', runner);

        expect(app.patch).toHaveBeenCalledWith('/channels/:id', runner);
        expect(app.patch).toHaveBeenCalledWith('/channels/:id.json', runner);
      });
    });

    describe('#destroy', function() {
      beforeEach(function() {
        only = ['destroy'];

        resources();
      });

      it('should add the destroy route', function() {
        var runner = new Responder(ChannelsController, 'destroy').run;

        expect(app.delete).toHaveBeenCalledWith('/channels/:id', runner);
        expect(app.delete).toHaveBeenCalledWith('/channels/:id.json', runner);
      });
    });
  });

  describe('.realtime', function() {
    var io, socket, onNames, onCallbacks;
    var RealtimeTestsController, RealtimeController = require('../index').RealtimeController;
    var realtime = function() {
      Routing.realtime('realtime_tests', { only: ['create', 'update'] });
      Routing.done();
    };

    beforeEach(function() {
      onNames = []; onCallbacks = [];

      io = global.io = jasmine.createSpyObj('socket.io - IO', ['on']);

      io.on.and.callFake(function(a,callback) {
        expect(a).toBe('connection');
        callback(socket);
      });

      socket = jasmine.createSpyObj('socket.io - Socket', ['on']);

      socket.on.and.callFake(function(a,c) {
        onNames.push(a); onCallbacks.push(c);
      });

      global.RealtimeTestsController$createCalled = null;
      global.RealtimeTestsController$updatedCalled = null;

      realtime();
    });

    it('should listen for connection', function() {
      expect(io.on).toHaveBeenCalledWith('connection', jasmine.any(Function));
    });

    it('should route the actions', function() {
      expect(onNames.length).toBe(2);
      expect(onNames[0]).toBe('realtime_tests:create');
      expect(onNames[1]).toBe('realtime_tests:update');
    });

    it('should not have called the controller', function() {
      expect(global.RealtimeTestsController$createCalled).toBeNull();
      expect(global.RealtimeTestsController$updatedCalled).toBeNull();
    });

    describe('when a create is received', function() {
      beforeEach(function() {
        onCallbacks[0]({foo: 'bar', baz: 4});
      });

      it('should have called create', function() {
        expect(global.RealtimeTestsController$createCalled.params).toEqual({ controller: 'realtime_tests', action: 'create', foo: 'bar', baz: 4 });
      });
    });

    describe('when a create is received', function() {
      beforeEach(function() {
        onCallbacks[1]({foo: 'baz', bar: 4});
      });

      it('should have called create', function() {
        expect(global.RealtimeTestsController$updatedCalled.params).toEqual({ controller: 'realtime_tests', action: 'update', foo: 'baz', bar: 4 });
      });
    });
  });
});
