const modules = require('./modules').default;

var genericSelector = function querySelector(data) {
  return document.querySelector(data.selector);
};

var genericReturn = () => {};

function waitForElement(argDict, find, transform) {
  var findFn = find ? find : genericSelector;
  var transformFn = transform ? transform : genericReturn;

  var findStr = JSON.stringify({src: findFn.toString()});
  var transformStr = JSON.stringify({src: transformFn.toString()});

  return {
    args: [argDict, findStr, transformStr],
    fn: function waitThenFn(argDict, findStr, transformStr) {
      var findFn = window.BurnsideModules.parseFn(findStr);
      var transformFn = window.BurnsideModules.parseFn(transformStr);
      return window.BurnsideModules.mutationObserver.wait(argDict, findFn, transformFn);
    }
  };
}

function waitForSel(selector, timeout) {
  return waitForElement({selector: selector, timeout: timeout});
}

function getText(selector, timeout) {
  var getText = function getText(el) {
    return el.textContent;
  };

  return waitForElement({selector: selector, timeout: timeout}, false, getText);
}

function getHTML(selector, timeout) {
  function getHTML(el) {
    return el.innerHTML;
  }

  return waitForElement({selector: selector, timeout: timeout}, false, getHTML);
}

function getAttribute(selector, attribute, timeout) {
  function getAttribute(el, data) {
    return el.getAttribute(data.attribute);
  }

  return waitForElement({selector: selector, attribute: attribute, timeout: timeout}, false, getAttribute);
}

function setAttribute(selector, attribute, value, timeout) {
  function setAttribute(el, data) {
    el.setAttribute(data.attribute, data.value);
  }

  return waitForElement({selector: selector, attribute: attribute, value: value, timeout: timeout}, false, setAttribute);
}

function getProperty(selector, attribute, timeout) {
  function getProperty(el, data) {
    return el[data.attribute];
  }

  return waitForElement({selector: selector, attribute: attribute, timeout: timeout}, false, getProperty);
}

function setProperty(selector, attribute, value, timeout) {
  var setProperty = function setProperty(el, data) {
    el[data.attribute] = data.value;
  };

  return waitForElement({selector: selector, attribute: attribute, value: value, timeout: timeout}, false, setProperty);
}

function setFormValue(selector, value, timeout) {
  var setPropertyAndChange = function setPropertyAndChange(el, data) {
    el.value = data.value;
    window.BurnsideModules.eventing.trigger(el, Object.assign(data, {event: 'change'}));
  };

  return waitForElement({selector: selector, value: value, timeout: timeout}, false, setPropertyAndChange);
}

function click(selector, timeout) {
  function thenClick(el) {
    // force any links to redirect inside the iframe
    el.target = '_self';
    el.click();
  }
  return waitForElement({selector: selector, timeout: timeout}, false, thenClick);
}

function countElements(selector, timeout) {
  function getAllElements(data) {
    return document.querySelectorAll(data.selector);
  }
  function getLength(els) {
    return els.length;
  }
  return waitForElement({selector: selector, timeout: timeout}, getAllElements, getLength);
}

function visible(selector, timeout) {
  function isSelectorVisible(data) {
    const el = document.querySelector(data.selector);
    if (el) {
      return window.BurnsideModules.domUtil.isVisible(el);
    }
    return false;
  }
  return waitForElement({selector: selector, timeout: timeout}, isSelectorVisible);
}

function notVisible(selector, timeout) {
  function isSelectorInvisible(data) {
    const el = document.querySelector(data.selector);
    if (el) {
      return !window.BurnsideModules.domUtil.isVisible(el);
    }
    return true;
  }
  return waitForElement({selector: selector, timeout: timeout}, isSelectorInvisible);
}

function waitForCondition(args, fn, timeout) {
  this.wait(args, fn, true, timeout);
}

module.exports = {
  modules: modules,
  functions: {
    waitForElement: waitForSel,
    exists: waitForSel,
    getText,
    getHTML,
    getAttribute,
    setAttribute,
    getProperty,
    setProperty,
    setFormValue,
    click,
    countElements,
    visible,
    notVisible,
    waitForCondition
  }
};
