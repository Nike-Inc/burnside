module.exports.default = function eventing() {
  this.trigger = function trigger(el, data) {
    var customEvt = new CustomEvent(data.event);
    if (data.eventProperties) {
      customEvt = Object.assign(customEvt, data.eventProperties);
    }
    customEvt.initCustomEvent(data.event, false, false, data.detail);
    el.dispatchEvent(customEvt);
  };
};
