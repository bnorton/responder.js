# responder.js

[![Circle CI](https://circleci.com/gh/bnorton/responder.js.svg?style=svg)](https://circleci.com/gh/bnorton/responder.js)
[![npm version](https://badge.fury.io/js/responder.js.svg)](http://badge.fury.io/js/responder.js)

#Getting started

###Install it
```bash
$ npm install responder.js
```

###Require it
```javascript
var Responder = require('responder.js').Responder;
var RequestController = require('responder.js').RequestController;
var RealtimeController = require('responder.js').RealtimeController;

var Routing = require('responder.js').Routing;
```

###Use it
```javascript
Routing.resources('channels', { only: ['index', 'create', 'update'] });
Routing.realtime('notes');
Routing.done();
```
