var _get = function(obj,i) { return _.result(obj, i) },
  get = function(obj, value) {
    return value.split('.').reduce(_get, obj) || null;
  };

exports = module.exports = get;
