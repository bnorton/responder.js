exports = module.exports = function(name) {
  return name.replace(/Controller/, '').split(/(?=[A-Z])/).map(function(part) {
    return part.toLowerCase();
  }).join('_');
};
