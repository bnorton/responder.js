require('./helpers/spec_helper.js');

var Responder = require('../index').Responder,
  RequestController = require('../index').RequestController,
  ResponderTestsController = require('../examples/controllers/realtime_tests');

describe(Responder.className, function() {
  var request, response, body, params, _name, responder = function() {
    return (new Responder(ResponderTestsController, _name))
      .run(request, response);
  };

  beforeEach(function() { _name = 'create';
    request = jasmine.createSpy('request');
    request.body = body = { body: '1' };
    request.params = params = { params: '2' };
    response = jasmine.createSpyObj('response', ['status', 'json', 'redirect']);
  });

  describe('.run', function() {
    var instance;

    beforeEach(function() {
      instance = responder();
    });

    it('should return the controller instance', function() {
      expect(instance.className).toBe('RealtimeTestsController');
    });

    it('should merge the body and params', function() {
      expect(instance.params.body).toBe('1');
      expect(instance.params.params).toBe('2');
    });

    it('should add the controller name and action', function() {
      expect(instance.params.controller).toBe('realtime_tests');
      expect(instance.params.action).toBe('create');
    });

    it('should add the request and response', function() {
      expect(instance.request).toBe(request);
      expect(instance.response).toBe(response);
    });
  });

  describe('RequestController#sendJSON', function() {
    var instance;

    beforeEach(function() {
      _name = 'create';
    });

    describe('when sending model-like things', function() {
      beforeEach(function() {
        instance = responder();
        instance.sendJSON({className: 'givenClassName', asJSON: function() { return {foo: 'bar'} } });
      });

      it('should have the status', function() {
        expect(response.status).toHaveBeenCalledWith(201);
      });

      it('should have the data', function() {
        expect(response.json).toHaveBeenCalledWith({status: 201, meta: {}, given_class_name: {foo: 'bar'}});
      });
    });

    describe('when sending relation-like things', function() {
      beforeEach(function() { _name = 'index';
        instance = responder();

        instance.sendJSON({ modelClass: { className: 'givenModelName' }, asJSON: function() { return [{id: 3}, {id: '55'}]; } });
      });

      it('should have the status', function() {
        expect(response.status).toHaveBeenCalledWith(200);
      });

      it('should have the data', function() {
        var args = response.json.calls.mostRecent().args;

        expect(args[0].status).toBe(200);
        expect(args[0].meta).toEqual({});
        expect(args[0].given_model_names.length).toBe(2);
        expect(args[0].given_model_names[0]).toEqual({id: 3});
        expect(args[0].given_model_names[1]).toEqual({id: '55'});
      });
    });

    describe('when sending other objects', function() {
      beforeEach(function() { _name = 'create';
        instance = responder();
        instance.sendJSON(['', [], false][Math.floor(Math.random()*3)]);
      });

      it('should skip it', function() {
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({status: 201, meta: {}});
      });
    });
  });

  describe('RequestController#send401', function() {
    beforeEach(function() {
      responder().send401();
    });

    it('should be a 401', function() {
      expect(response.status).toHaveBeenCalledWith(401);

    });

    it('should send the error info', function() {
      expect(response.json).toHaveBeenCalledWith({code: 401, meta: {}, error: { message: 'Authentication error' }});
    });
  });

  describe('RequestController#send302', function() {
    beforeEach(function() {
      responder().send302('foo-bar');
    });

    it('should redirect to the target', function() {
      expect(response.redirect).toHaveBeenCalledWith(302, 'foo-bar');
    });

    it('should be bound', function() {
      responder().send302.call(global, 'foo-bar-baz');
      expect(response.redirect).toHaveBeenCalledWith(302, 'foo-bar-baz');
    })
  });

  describe('RequestController#send404', function() {
    beforeEach(function() {
      responder().send404();
    });

    it('should be a 404', function() {
      expect(response.status).toHaveBeenCalledWith(404);

    });

    it('should send the error info', function() {
      expect(response.json).toHaveBeenCalledWith({code: 404, meta: {}, error: { message: 'Resource not found' }});
    });
  });

  describe('RequestController#send422', function() {
    beforeEach(function() {
      responder().send422();
    });

    it('should be a 422', function() {
      expect(response.status).toHaveBeenCalledWith(422);

    });

    it('should send the error info', function() {
      expect(response.json).toHaveBeenCalledWith({code: 422, meta: {}, error: { message: 'Unprocessable request' }});
    });
  });

  describe('RequestController#send500', function() {
    beforeEach(function() {
      responder().send500();
    });

    it('should be a 500', function() {
      expect(response.status).toHaveBeenCalledWith(500);

    });

    it('should send the error info', function() {
      expect(response.json).toHaveBeenCalledWith({code: 500, meta: {}, error: { message: 'Server error' }});
    });
  });
});
