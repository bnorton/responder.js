/*!
 * responder.js (c) 2015 Brian Norton
 * This library may be freely distributed under the MIT license.
 */
require('progenitor.js')();

exports = module.exports = {
  Responder: require('./lib/responder'),
  Routing: require('./lib/routing'),
  RequestController: require('./lib/request'),
  RealtimeController: require('./lib/realtime')
};
