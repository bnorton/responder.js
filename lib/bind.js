exports = module.exports = function(target, names) {
  names = [];
  names = names.concat.apply(names, Array.prototype.slice.call(arguments, 1));

  names.forEach(function(name) {
    if(typeof target[name] === 'function') {
      target[name] = target[name].bind(target);
    }
  });
};
