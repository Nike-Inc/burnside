module.exports.default = function domUtil() {
  this.guid = () => {
    var s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  };
  this.isVisible = function isVisibleFn(el) {
    const style = window.getComputedStyle(el);

    return parseInt(style.width, 10) !== 0 &&
      parseInt(style.height, 10) !== 0 &&
      parseInt(style.opacity, 10) !== 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden';
  };
};
