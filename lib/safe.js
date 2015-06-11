exports = module.exports = function(fn) {
  try {
    fn.call(global);
  } catch(e) { }
};
