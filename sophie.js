/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Register = __webpack_require__(1);
	var Element = __webpack_require__(5);

	var _require = __webpack_require__(6);

	var dom = _require.dom;
	var element = _require.element;

	var Import = __webpack_require__(32);
	var StyleSheet = __webpack_require__(33);
	var Compontent = __webpack_require__(40);
	var Bootstrap = __webpack_require__(41);
	var EE = __webpack_require__(3);

	var Sophie = {
	  runApp: Bootstrap.runApp,
	  ready: Bootstrap.ready,
	  renderElement: Bootstrap.renderElement,
	  mountElement: dom.mountElement,
	  createVnodeByTagName: Bootstrap.createVnodeByTagName,

	  createElementByVnode: Bootstrap.createElementByVnode,

	  createElementByTagName: Bootstrap.createElementByTagName,

	  element: Element,
	  register: Register.register,
	  createClass: Compontent,
	  import: Import,
	  createStyleSheet: StyleSheet.create,
	  StyleSheet: StyleSheet,
	  on: function on() {
	    EE.on.apply(EE, arguments);
	  },
	  isLeaf: Register.isLeaf,
	  isSophie: Register.isLeaf,
	  upgrade: Register.upgrade,
	  registry: Register.registry,
	  upgradeDocument: Register.upgradeDocument,
	  isThunk: function isThunk(node) {
	    return node.type === '#thunk';
	  }

	};

	window.Sophie = Sophie;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(2);
	var EE = __webpack_require__(3);
	var element = __webpack_require__(5);

	var _require = __webpack_require__(6);

	var dom = _require.dom;
	var diff = _require.diff;
	var vnode = _require.vnode;

	var registry = {};

	function register(inName, inOptions) {

	  if (!inOptions) {
	    inOptions = inName;
	    inName = "undefined";
	  }

	  var definition = inOptions || {};
	  if (!inName) {
	    throw new Error('Name argument must not be empty');
	  }

	  definition.name = inName;
	  resolveTagName(definition);
	  resolveMixin(definition);

	  var createFun = function createFun() {
	    this.state = {};
	    this.children = [];
	    this.refs = {};
	  };

	  var oldRender = definition.render;
	  var oldComponentDidMount = definition.componentDidMount;
	  var oldComponentWillMount = definition.componentWillMount;

	  createFun.prototype = definition;

	  if (Sophie && Sophie.renderRootElement) {
	    createFun.prototype.render = function () {
	      return this.element(this.name, this.attributes, oldRender.apply(this, arguments));
	    };
	  }

	  createFun.prototype.componentDidMount = function () {
	    oldComponentDidMount && oldComponentDidMount.apply(this, arguments);
	    EE.trigger("componentDidMount", [this.node]);
	  };

	  createFun.prototype.componentWillMount = function () {
	    oldComponentWillMount && oldComponentWillMount.apply(this, arguments);
	    EE.trigger("oldComponentWillMount", [this.node]);
	  };

	  //for decleare
	  // createFun.prototype.getDefaultProps = function(){}
	  // createFun.prototype.getInitialState = function(){}

	  createFun.prototype.setState = function (value) {

	    this.state = value;
	    this._update();
	  };

	  // //重置render方法，生成根元素
	  // var oRender = definition.render;
	  // createFun.prototype.render = function(){
	  //   return element(this.name,this.props,oRender.apply(this,arguments));
	  // }

	  createFun.prototype._update = function () {

	    var oldVnode = this.vnode;
	    var newVnode = this.render();
	    var changes = diff.diffNode(oldVnode, newVnode, vnode.createPath(this.path, oldVnode.key || "0"));
	    this.node = changes.reduce(dom.patch({}, this.ovnode), this.node);
	    this.vnode = newVnode;
	    return this.node;
	  };

	  createFun.prototype.element = function () {
	    var vnode = element.apply(null, arguments);
	    vnode.compontentContext = this.ovnode;

	    if (vnode.attributes && vnode.attributes["ref"]) {
	      var refValue = vnode.attributes["ref"];
	      this.refs[refValue] = vnode;
	    }

	    return vnode;
	  }, createFun.prototype.append = function (child) {
	    var children = this.children;
	    child.parent = this;
	    child.compontentContext = this.compontentContext;
	    children.push(child);
	    this._update();
	  };

	  createFun.prototype.remove = function (child) {
	    var parent = this;
	    var children = parent.children;
	    for (var i = 0; i < children.length; i++) {
	      if (children[i] == child) {
	        //  children[i].parent = undefined
	        children.splice(i, 1);

	        break;
	      }
	    }
	    this._update();
	  };

	  createFun.prototype.insertBefore = function (target, before) {
	    var parent = this;
	    var children = parent.children;
	    for (var i = 0; i < children.length; i++) {
	      if (children[i] == before) {
	        children.splice(i, 0, target);
	        target.compontentContext = this.compontentContext;
	        target.parent = parent;
	        break;
	      }
	    }
	    this._update();
	  };

	  createFun.prototype.insertAfter = function (target, after) {
	    var parent = this;
	    var children = parent.children;
	    for (var i = 0; i < children.length; i++) {
	      if (children[i] == after) {
	        children.splice(i + 1, 0, target);
	        target.parent = parent;
	        target.compontentContext = this.compontentContext;
	        break;
	      }
	    }
	    this._update();
	  };

	  if (inName !== "undefined") {
	    registerDefinition(inName, createFun);
	    document.createElement(inName);
	  }

	  createFun.prototype.constructor = createFun;

	  return createFun;
	}

	function resolveTagName(inDefinition) {
	  inDefinition.tagName = inDefinition.name;
	  inDefinition.type = inDefinition.name;
	}

	function resolveMixin(inDefinition) {
	  var mixin = inDefinition.mixin || [];
	  for (var i = 0; i < mixin.length; i++) {
	    var pName = mixin[i];
	    var pDefinition = registry[pName] || {};
	    for (var p in pDefinition) {
	      if (!inDefinition[p]) {
	        inDefinition[p] = pDefinition[p];
	      }
	    }
	  }
	}

	function registerDefinition(inName, inDefinition) {
	  registry[inName] = inDefinition;
	}

	function walkRoot(root, callback) {
	  var child = root.childNodes;
	  for (var i = 0; i < child.length; i++) {

	    var el = child[i];
	    if (el.nodeType == 1) {
	      var tagName = el.tagName.toLowerCase();
	      var result = callback(el, tagName);
	      if (result !== false) {
	        walkRoot(child[i], callback);
	      }
	    }
	  }
	}

	var getRegName = function getRegName(el) {

	  var name = el.tagName.toLowerCase();
	  var className = el.className;
	  className = (" " + className + " ").replace(/[\n\t]/g, " ");

	  for (var regName in registry) {

	    var tn;
	    var cn;
	    var regNames = regName.split(".");

	    if (regNames.length == 1) {
	      tn = regNames[0];
	      if (tn === name) {

	        return tn;
	      }
	    } else if (regNames.length == 2) {
	      tn = regNames[0];
	      cn = regNames[1];

	      if (tn && cn) {
	        cn = " " + cn + " ";
	        if (tn == name && className.indexOf(cn) > -1) {
	          return regName;
	        }
	      } else if (cn) {
	        if (className.indexOf(cn) > -1) {
	          return regName;
	        }
	      }
	    }
	  }
	};

	function render(newVnode, inElement) {

	  // attributes: attributes,
	  // children: children,
	  // type: type,
	  // key: key

	  var el = newVnode.render(newVnode);
	  var domElement = dom.createElement(el, null, null, newVnode);
	  inElement.innerHTML = "";
	  inElement.appendChild(domElement);
	}

	function createVnodeFromDOMElement(el) {

	  //文本
	  if (el.nodeType == 3) {
	    return {
	      type: '#text',
	      nodeValue: el.nodeValue,
	      nativeNode: el
	    };
	  }
	  //标签
	  else if (el.nodeType == 1) {
	      var type = el.tagName.toLowerCase();
	      var attrs = el.attributes;
	      var attributes = {};
	      for (var i = 0; i < attrs.length; i++) {
	        attributes[attrs[i].name] = attributes[attrs[i].value];
	      }

	      //@todo props
	      return {
	        type: type,
	        attributes: attributes,
	        nativeNode: el,
	        children: []
	      };
	    }
	}

	function implement(inElement, inDefinition) {
	  var vnode = new inDefinition();
	  vnode.nativeNode = inElement;
	  return vnode;
	}

	function registerDOMProp(vnode, inElement) {
	  var attrs = inElement.attributes;
	  var attributes = {};
	  for (var i = 0; i < attrs.length; i++) {
	    attributes[attrs[i].name] = attributes[attrs[i].value];
	  }
	  vnode.attributes = attributes;
	}

	function getDOMAttrs(inElement) {
	  var attrs = inElement.attributes;
	  var attributes = {};
	  for (var i = 0; i < attrs.length; i++) {
	    attributes[attrs[i].name] = attributes[attrs[i].value];
	  }

	  return attributes;
	}

	function upgrade(inElement) {

	  if (!inElement.tagName) return;

	  //如果已经更新过，就查看子元素是不是全部更新过
	  if (inElement.__upgraded__) {} else {

	    var name = inElement.tagName.toLowerCase();
	    var inDefinition = registry[name];
	    if (inDefinition) {
	      EE.trigger("beforeCreate", [inElement]);
	      var vnode = implement(inElement, inDefinition);

	      return vnode;
	    }
	  }
	}

	function readyUpgrage(vnode) {

	  if ((0, dom.element.isThunk)(vnode)) {

	    var component = vnode.component;

	    //保留输出，setState，进行对比
	    var output = component.vnode;

	    output.children.forEach(function (node, index) {
	      if (node === null || node === undefined) {
	        return;
	      }
	      var child = readyUpgrage(node);
	    });

	    EE.trigger("onCreate", [vnode.nativeNode]);
	  }
	}

	function readyUpgrage(inElement) {
	  inElement.__upgraded__ = true;
	  EE.trigger("onCreate", [inElement]);
	}

	function isLeaf(inElement) {
	  if (inElement) {
	    var name = inElement.tagName.toLowerCase();
	    return registry[name];
	  }
	}

	var isReady = false;

	var upgradeDocument = function upgradeDocument(doc) {
	  var rootDOM = document.body;
	  var rootVnode = createVnodeFromDOMElement(document.body);
	  var appRoot;
	  var func = function func(el) {
	    var children = el.children;
	    var vnode;
	    var tagName = el.tagName.toLowerCase();

	    if (isLeaf(el)) {
	      var inDefinition = registry[tagName];

	      var vnodeChildren = [];

	      for (var i = 0; i < children.length; i++) {
	        var child = children[i];
	        var childVnode = func(child);
	        vnodeChildren.push(childVnode);
	      }

	      vnode = element(inDefinition, getDOMAttrs(el), vnodeChildren);

	      //根元素只能有一个
	      appRoot = vnode;

	      vnode.nativeNode = el;
	    } else if (el.nodeType == 1) {

	      var vnodeChildren = [];

	      for (var i = 0; i < children.length; i++) {
	        var child = children[i];
	        var childVnode = func(child);
	        vnodeChildren.push(childVnode);
	      }

	      vnode = element(tagName, getDOMAttrs(el), vnodeChildren);
	      vnode.nativeNode = el;
	    } else if (el.nodeType == 3) {
	      vnode = el.nodeValue;
	    }
	    return vnode;
	  };

	  func(rootDOM, rootVnode);

	  if (appRoot) {
	    var rootId = "0";

	    dom.createElement(appRoot, rootId, null, null);
	    dom.mountElement(appRoot);
	    readyUpgrage(appRoot);
	  }
	};

	// utils.ready(function () {
	//     isReady = true;
	//     console.log("ready")
	//     upgradeDocument();
	// })

	module.exports = {

	  registry: registry,
	  isLeaf: isLeaf,
	  upgrade: upgrade,

	  upgradeDocument: upgradeDocument,
	  register: register
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    ready: function ready(func) {
	        if (window.jQuery) {
	            jQuery(document).ready(func);
	        } else {
	            // Use the handy event callback
	            document.addEventListener("DOMContentLoaded", func, false);
	        }
	    }

	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EventEmitter = __webpack_require__(4);
	var ee = new EventEmitter();

	module.exports = ee;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * EventEmitter v4.2.11 - git.io/ee
	 * Unlicense - http://unlicense.org/
	 * Oliver Caldwell - http://oli.me.uk/
	 * @preserve
	 */

	;(function () {
	    'use strict';

	    /**
	     * Class for managing events.
	     * Can be extended to provide event functionality in other classes.
	     *
	     * @class EventEmitter Manages event registering and emitting.
	     */
	    function EventEmitter() {}

	    // Shortcuts to improve speed and size
	    var proto = EventEmitter.prototype;
	    var exports = this;
	    var originalGlobalValue = exports.EventEmitter;

	    /**
	     * Finds the index of the listener for the event in its storage array.
	     *
	     * @param {Function[]} listeners Array of listeners to search through.
	     * @param {Function} listener Method to look for.
	     * @return {Number} Index of the specified listener, -1 if not found
	     * @api private
	     */
	    function indexOfListener(listeners, listener) {
	        var i = listeners.length;
	        while (i--) {
	            if (listeners[i].listener === listener) {
	                return i;
	            }
	        }

	        return -1;
	    }

	    /**
	     * Alias a method while keeping the context correct, to allow for overwriting of target method.
	     *
	     * @param {String} name The name of the target method.
	     * @return {Function} The aliased method
	     * @api private
	     */
	    function alias(name) {
	        return function aliasClosure() {
	            return this[name].apply(this, arguments);
	        };
	    }

	    /**
	     * Returns the listener array for the specified event.
	     * Will initialise the event object and listener arrays if required.
	     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	     * Each property in the object response is an array of listener functions.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Function[]|Object} All listener functions for the event.
	     */
	    proto.getListeners = function getListeners(evt) {
	        var events = this._getEvents();
	        var response;
	        var key;

	        // Return a concatenated array of all matching events if
	        // the selector is a regular expression.
	        if (evt instanceof RegExp) {
	            response = {};
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    response[key] = events[key];
	                }
	            }
	        }
	        else {
	            response = events[evt] || (events[evt] = []);
	        }

	        return response;
	    };

	    /**
	     * Takes a list of listener objects and flattens it into a list of listener functions.
	     *
	     * @param {Object[]} listeners Raw listener objects.
	     * @return {Function[]} Just the listener functions.
	     */
	    proto.flattenListeners = function flattenListeners(listeners) {
	        var flatListeners = [];
	        var i;

	        for (i = 0; i < listeners.length; i += 1) {
	            flatListeners.push(listeners[i].listener);
	        }

	        return flatListeners;
	    };

	    /**
	     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Object} All listener functions for an event in an object.
	     */
	    proto.getListenersAsObject = function getListenersAsObject(evt) {
	        var listeners = this.getListeners(evt);
	        var response;

	        if (listeners instanceof Array) {
	            response = {};
	            response[evt] = listeners;
	        }

	        return response || listeners;
	    };

	    /**
	     * Adds a listener function to the specified event.
	     * The listener will not be added if it is a duplicate.
	     * If the listener returns true then it will be removed after it is called.
	     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListener = function addListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var listenerIsWrapped = typeof listener === 'object';
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
	                listeners[key].push(listenerIsWrapped ? listener : {
	                    listener: listener,
	                    once: false
	                });
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of addListener
	     */
	    proto.on = alias('addListener');

	    /**
	     * Semi-alias of addListener. It will add a listener that will be
	     * automatically removed after its first execution.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addOnceListener = function addOnceListener(evt, listener) {
	        return this.addListener(evt, {
	            listener: listener,
	            once: true
	        });
	    };

	    /**
	     * Alias of addOnceListener.
	     */
	    proto.once = alias('addOnceListener');

	    /**
	     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	     * You need to tell it what event names should be matched by a regex.
	     *
	     * @param {String} evt Name of the event to create.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvent = function defineEvent(evt) {
	        this.getListeners(evt);
	        return this;
	    };

	    /**
	     * Uses defineEvent to define multiple events.
	     *
	     * @param {String[]} evts An array of event names to define.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvents = function defineEvents(evts) {
	        for (var i = 0; i < evts.length; i += 1) {
	            this.defineEvent(evts[i]);
	        }
	        return this;
	    };

	    /**
	     * Removes a listener function from the specified event.
	     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to remove the listener from.
	     * @param {Function} listener Method to remove from the event.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListener = function removeListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var index;
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key)) {
	                index = indexOfListener(listeners[key], listener);

	                if (index !== -1) {
	                    listeners[key].splice(index, 1);
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of removeListener
	     */
	    proto.off = alias('removeListener');

	    /**
	     * Adds listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	     * You can also pass it a regular expression to add the array of listeners to all events that match it.
	     * Yeah, this function does quite a bit. That's probably a bad thing.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListeners = function addListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(false, evt, listeners);
	    };

	    /**
	     * Removes listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be removed.
	     * You can also pass it a regular expression to remove the listeners from all events that match it.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListeners = function removeListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(true, evt, listeners);
	    };

	    /**
	     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	     * The first argument will determine if the listeners are removed (true) or added (false).
	     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added/removed.
	     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	     *
	     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
	        var i;
	        var value;
	        var single = remove ? this.removeListener : this.addListener;
	        var multiple = remove ? this.removeListeners : this.addListeners;

	        // If evt is an object then pass each of its properties to this method
	        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
	            for (i in evt) {
	                if (evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if (typeof value === 'function') {
	                        single.call(this, i, value);
	                    }
	                    else {
	                        // Otherwise pass back to the multiple function
	                        multiple.call(this, i, value);
	                    }
	                }
	            }
	        }
	        else {
	            // So evt must be a string
	            // And listeners must be an array of listeners
	            // Loop over it and pass each one to the multiple method
	            i = listeners.length;
	            while (i--) {
	                single.call(this, evt, listeners[i]);
	            }
	        }

	        return this;
	    };

	    /**
	     * Removes all listeners from a specified event.
	     * If you do not specify an event then all listeners will be removed.
	     * That means every event will be emptied.
	     * You can also pass a regex to remove all events that match it.
	     *
	     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeEvent = function removeEvent(evt) {
	        var type = typeof evt;
	        var events = this._getEvents();
	        var key;

	        // Remove different things depending on the state of evt
	        if (type === 'string') {
	            // Remove all listeners for the specified event
	            delete events[evt];
	        }
	        else if (evt instanceof RegExp) {
	            // Remove all events matching the regex.
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    delete events[key];
	                }
	            }
	        }
	        else {
	            // Remove all listeners in all events
	            delete this._events;
	        }

	        return this;
	    };

	    /**
	     * Alias of removeEvent.
	     *
	     * Added to mirror the node API.
	     */
	    proto.removeAllListeners = alias('removeEvent');

	    /**
	     * Emits an event of your choice.
	     * When emitted, every listener attached to that event will be executed.
	     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	     * So they will not arrive within the array on the other side, they will be separate.
	     * You can also pass a regular expression to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {Array} [args] Optional array of arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emitEvent = function emitEvent(evt, args) {
	        var listenersMap = this.getListenersAsObject(evt);
	        var listeners;
	        var listener;
	        var i;
	        var key;
	        var response;

	        for (key in listenersMap) {
	            if (listenersMap.hasOwnProperty(key)) {
	                listeners = listenersMap[key].slice(0);
	                i = listeners.length;

	                while (i--) {
	                    // If the listener returns true then it shall be removed from the event
	                    // The function is executed either with a basic call or an apply if there is an args array
	                    listener = listeners[i];

	                    if (listener.once === true) {
	                        this.removeListener(evt, listener.listener);
	                    }

	                    response = listener.listener.apply(this, args || []);

	                    if (response === this._getOnceReturnValue()) {
	                        this.removeListener(evt, listener.listener);
	                    }
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of emitEvent
	     */
	    proto.trigger = alias('emitEvent');

	    /**
	     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {...*} Optional additional arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emit = function emit(evt) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return this.emitEvent(evt, args);
	    };

	    /**
	     * Sets the current value to check against when executing listeners. If a
	     * listeners return value matches the one set here then it will be removed
	     * after execution. This value defaults to true.
	     *
	     * @param {*} value The new value to check for when executing listeners.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.setOnceReturnValue = function setOnceReturnValue(value) {
	        this._onceReturnValue = value;
	        return this;
	    };

	    /**
	     * Fetches the current value to check against when executing listeners. If
	     * the listeners return value matches this one then it should be removed
	     * automatically. It will return true by default.
	     *
	     * @return {*|Boolean} The current value to check for or the default, true.
	     * @api private
	     */
	    proto._getOnceReturnValue = function _getOnceReturnValue() {
	        if (this.hasOwnProperty('_onceReturnValue')) {
	            return this._onceReturnValue;
	        }
	        else {
	            return true;
	        }
	    };

	    /**
	     * Fetches the events object and creates one if required.
	     *
	     * @return {Object} The events storage object.
	     * @api private
	     */
	    proto._getEvents = function _getEvents() {
	        return this._events || (this._events = {});
	    };

	    /**
	     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	     *
	     * @return {Function} Non conflicting EventEmitter class.
	     */
	    EventEmitter.noConflict = function noConflict() {
	        exports.EventEmitter = originalGlobalValue;
	        return EventEmitter;
	    };

	    // Expose the class either via AMD, CommonJS or the global object
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return EventEmitter;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    else if (typeof module === 'object' && module.exports){
	        module.exports = EventEmitter;
	    }
	    else {
	        exports.EventEmitter = EventEmitter;
	    }
	}.call(this));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _require = __webpack_require__(6);

	var dom = _require.dom;
	var diff = _require.diff;
	var element = _require.element;
	var vnode = _require.vnode;

	module.exports = function () {

	  var vnode = element.apply(null, arguments);
	  return vnode;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.h = exports.dom = exports.diff = exports.vnode = exports.string = exports.element = undefined;

	var _diff = __webpack_require__(7);

	var diff = _interopRequireWildcard(_diff);

	var _element = __webpack_require__(8);

	var vnode = _interopRequireWildcard(_element);

	var _string = __webpack_require__(20);

	var string = _interopRequireWildcard(_string);

	var _dom = __webpack_require__(22);

	var dom = _interopRequireWildcard(_dom);

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj.default = obj;return newObj;
	  }
	}

	var element = vnode.create;
	var h = vnode.create;

	exports.element = element;
	exports.string = string;
	exports.vnode = vnode;
	exports.diff = diff;
	exports.dom = dom;
	exports.h = h;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Actions = undefined;
	exports.diffAttributes = diffAttributes;
	exports.diffChildren = diffChildren;
	exports.diffNode = diffNode;

	var _element = __webpack_require__(8);

	var _dift = __webpack_require__(11);

	var diffActions = _interopRequireWildcard(_dift);

	var _unionType = __webpack_require__(13);

	var _unionType2 = _interopRequireDefault(_unionType);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj.default = obj;return newObj;
	  }
	}

	var Any = function Any() {
	  return true;
	};
	var Path = function Path() {
	  return String;
	};

	/**
	 * Patch actions
	 */

	var Actions = exports.Actions = (0, _unionType2.default)({
	  setAttribute: [String, Any, Any],
	  removeAttribute: [String, Any],
	  insertChild: [Any, Number, Path],
	  removeChild: [Number],
	  updateChild: [Number, Array],
	  updateChildren: [Array],
	  insertBefore: [Number],
	  replaceNode: [Any, Any, Path],
	  removeNode: [Any],
	  sameNode: [],
	  updateThunk: [Any, Any, Path]
	});

	/**
	 * Diff two attribute objects and return an array of actions that represent
	 * changes to transform the old object into the new one.
	 */

	function diffAttributes(previous, next) {
	  var setAttribute = Actions.setAttribute;
	  var removeAttribute = Actions.removeAttribute;

	  var changes = [];
	  var pAttrs = previous.attributes;
	  var nAttrs = next.attributes;

	  for (var name in nAttrs) {
	    if (nAttrs[name] !== pAttrs[name]) {
	      changes.push(setAttribute(name, nAttrs[name], pAttrs[name]));
	    }
	  }

	  for (var name in pAttrs) {
	    if (!(name in nAttrs)) {
	      changes.push(removeAttribute(name, pAttrs[name]));
	    }
	  }

	  return changes;
	}

	/**
	 * Compare two arrays of virtual nodes and return an array of actions
	 * to transform the left into the right. A starting path is supplied that use
	 * recursively to build up unique paths for each node.
	 */

	function diffChildren(previous, next, parentPath) {
	  var insertChild = Actions.insertChild;
	  var updateChild = Actions.updateChild;
	  var removeChild = Actions.removeChild;
	  var insertBefore = Actions.insertBefore;
	  var updateChildren = Actions.updateChildren;
	  var CREATE = diffActions.CREATE;
	  var UPDATE = diffActions.UPDATE;
	  var MOVE = diffActions.MOVE;
	  var REMOVE = diffActions.REMOVE;

	  var previousChildren = (0, _element.groupByKey)(previous.children);
	  var nextChildren = (0, _element.groupByKey)(next.children);
	  var key = function key(a) {
	    return a.key;
	  };
	  var changes = [];

	  function effect(type, prev, next, pos) {
	    var nextPath = next ? (0, _element.createPath)(parentPath, next.key == null ? next.index : next.key) : null;
	    switch (type) {
	      case CREATE:
	        {
	          changes.push(insertChild(next.item, pos, nextPath));
	          break;
	        }
	      case UPDATE:
	        {
	          var actions = diffNode(prev.item, next.item, nextPath);
	          if (actions.length > 0) {
	            changes.push(updateChild(prev.index, actions));
	          }
	          break;
	        }
	      case MOVE:
	        {
	          var actions = diffNode(prev.item, next.item, nextPath);
	          actions.push(insertBefore(pos));
	          changes.push(updateChild(prev.index, actions));
	          break;
	        }
	      case REMOVE:
	        {
	          changes.push(removeChild(prev.index));
	          break;
	        }
	    }
	  }

	  (0, diffActions.default)(previousChildren, nextChildren, effect, key);

	  return updateChildren(changes);
	}

	/**
	 * Compare two virtual nodes and return an array of changes to turn the left
	 * into the right.
	 */

	function diffNode(prev, next, path) {
	  var changes = [];
	  var replaceNode = Actions.replaceNode;
	  var setAttribute = Actions.setAttribute;
	  var sameNode = Actions.sameNode;
	  var removeNode = Actions.removeNode;
	  var updateThunk = Actions.updateThunk;

	  // No left node to compare it to
	  // TODO: This should just return a createNode action

	  if (prev === null || prev === undefined) {
	    throw new Error('Left node must not be null or undefined');
	  }

	  // Bail out and skip updating this whole sub-tree
	  if (prev === next) {
	    changes.push(sameNode());
	    return changes;
	  }

	  // Remove
	  if (prev != null && next == null) {
	    changes.push(removeNode(prev));
	    return changes;
	  }

	  // Replace
	  if (prev.type !== next.type) {
	    changes.push(replaceNode(prev, next, path));
	    return changes;
	  }

	  // Text
	  if ((0, _element.isText)(next)) {
	    if (prev.nodeValue !== next.nodeValue) {
	      changes.push(setAttribute('nodeValue', next.nodeValue, prev.nodeValue));
	    }
	    return changes;
	  }

	  // Thunk
	  if ((0, _element.isThunk)(next)) {
	    if ((0, _element.isSameThunk)(prev, next)) {
	      changes.push(updateThunk(prev, next, path));
	    } else {
	      changes.push(replaceNode(prev, next, path));
	    }
	    return changes;
	  }

	  changes = diffAttributes(prev, next);
	  changes.push(diffChildren(prev, next, path));

	  return changes;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var merge = __webpack_require__(9);

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	if (!Array.isArray) {
	  Array.isArray = function (arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	  };
	}

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.create = create;
	exports.createTextElement = createTextElement;
	exports.createThunkElement = createThunkElement;
	exports.isValidAttribute = isValidAttribute;

	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}

	function _typeof(obj) {
	  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
	}

	/**
	 * This function lets us create virtual nodes using a simple
	 * syntax. It is compatible with JSX transforms so you can use
	 * JSX to write nodes that will compile to this function.
	 *
	 * let node = element('div', { id: 'foo' }, [
	 *   element('a', { href: 'http://google.com' },
	 *     element('span', {}, 'Google'),
	 *     element('b', {}, 'Link')
	 *   )
	 * ])
	 */

	function create(type, attributes) {
	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  if (!type) throw new TypeError('element() needs a type.');

	  attributes = attributes || {};
	  children = (children || []).reduce(reduceChildren, []);

	  var key = typeof attributes.key === 'string' || typeof attributes.key === 'number' ? attributes.key : undefined;

	  // delete attributes.key;

	  if (!key) {
	    key = attributes.key = attributes.id;
	  }

	  if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
	    return createThunkElement(type, key, attributes, children);
	  }

	  if (typeof type === 'function') {
	    type = new type();
	    return createThunkElement(type, key, attributes, children);
	  }

	  //创建标签

	  var result = {
	    attributes: attributes,
	    children: children,
	    type: type,
	    key: key
	  };

	  for (var i = 0; i < children.length; i++) {
	    if (!children[i]) continue;
	    if (children[i].parent) {} else {
	      children[i].parent = result;
	    }
	  }

	  return result;
	}

	/**
	 * Cleans up the array of child elements.
	 * - Flattens nested arrays
	 * - Converts raw strings and numbers into vnodes
	 * - Filters out undefined elements
	 */

	function reduceChildren(children, vnode) {
	  if (typeof vnode === 'string' || typeof vnode === 'number') {
	    children.push(createTextElement(vnode));
	  } else if (Array.isArray(vnode)) {
	    children = [].concat(_toConsumableArray(children), _toConsumableArray(vnode.reduce(reduceChildren, [])));
	  } else if (vnode) {
	    children.push(vnode);
	  }
	  return children;
	}

	/**
	 * Text nodes are stored as objects to keep things simple
	 */

	function createTextElement(text) {
	  return {
	    type: '#text',
	    nodeValue: text
	  };
	}

	/**
	 * Lazily-rendered virtual nodes
	 */

	function createThunkElement(component, key, props, children) {
	  if (!props) props = {};
	  // props.children = children;

	  component.key = key;
	  component.type = "#thunk";
	  component.component = component;

	  for (var i = 0; i < children.length; i++) {
	    if (!children[i]) continue;
	    if (children[i].parent) {} else {
	      children[i].parent = component;
	    }
	  }
	  component.children = children;

	  var defaultProps = component.getDefaultProps && component.getDefaultProps();
	  var newProps = merge.recursive(defaultProps || {}, props);
	  component.props = newProps;
	  component.attributes = newProps;

	  var defaultState = component.getInitialState && component.getInitialState();
	  var newState = merge.recursive({}, defaultState || {});
	  component.state = newState;

	  var result = {
	    type: '#thunk',
	    children: children,
	    props: newProps,
	    attributes: newProps,
	    component: component,
	    key: key
	  };

	  return component;
	}

	/**
	 * Is a vnode a thunk?
	 */

	var isThunk = exports.isThunk = function isThunk(node) {
	  return node.type === '#thunk';
	};

	/**
	 * Is a vnode a text node?
	 */

	var isText = exports.isText = function isText(node) {
	  return node.type === '#text';
	};

	/**
	 * Determine if two virtual nodes are the same type
	 */

	var isSameThunk = exports.isSameThunk = function isSameThunk(left, right) {
	  return isThunk(left) && isThunk(right) && left.component === right.component;
	};

	/**
	 * Group an array of virtual elements by their key, using index as a fallback.
	 */

	var groupByKey = exports.groupByKey = function groupByKey(children) {
	  return children.reduce(function (acc, child, i) {
	    if (child != null && child !== false) {
	      acc.push({
	        key: String(child.key || i),
	        item: child,
	        index: i
	      });
	    }
	    return acc;
	  }, []);
	};

	/**
	 * Check if an attribute should be rendered into the DOM.
	 */

	function isValidAttribute(value) {
	  if (typeof value === 'boolean') return value;
	  if (typeof value === 'function') return false;
	  if (value === '') return true;
	  if (value === undefined) return false;
	  if (value === null) return false;
	  return true;
	}

	/**
	 * Create a node path, eg. (23,5,2,4) => '23.5.2.4'
	 */

	var createPath = exports.createPath = function createPath() {
	  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    args[_key2] = arguments[_key2];
	  }

	  return args.join('.');
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function(isNode) {

		/**
		 * Merge one or more objects 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		var Public = function(clone) {

			return merge(clone === true, false, arguments);

		}, publicName = 'merge';

		/**
		 * Merge two or more objects recursively 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		Public.recursive = function(clone) {

			return merge(clone === true, true, arguments);

		};

		/**
		 * Clone the input removing any reference
		 * @param mixed input
		 * @return mixed
		 */

		Public.clone = function(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = Public.clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = Public.clone(input[index]);

			}

			return output;

		};

		/**
		 * Merge two objects recursively
		 * @param mixed input
		 * @param mixed extend
		 * @return mixed
		 */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object')

				return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);

				} else {

					base[key] = extend[key];

				}

			}

			return base;

		}

		/**
		 * Merge two or more objects
		 * @param bool clone
		 * @param bool recursive
		 * @param array argv
		 * @return object
		 */

		function merge(clone, recursive, argv) {

			var result = argv[0],
				size = argv.length;

			if (clone || typeOf(result) !== 'object')

				result = {};

			for (var index=0;index<size;++index) {

				var item = argv[index],

					type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);

					} else {

						result[key] = sitem;

					}

				}

			}

			return result;

		}

		/**
		 * Get type of variable
		 * @param mixed input
		 * @return string
		 *
		 * @see http://jsperf.com/typeofvar
		 */

		function typeOf(input) {

			return ({}).toString.call(input).slice(8, -1).toLowerCase();

		}

		if (isNode) {

			module.exports = Public;

		} else {

			window[publicName] = Public;

		}

	})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.REMOVE = exports.MOVE = exports.UPDATE = exports.CREATE = undefined;

	var _bitVector = __webpack_require__(12);

	/**
	 * Actions
	 */

	var CREATE = 0; /**
	                 * Imports
	                 */

	var UPDATE = 1;
	var MOVE = 2;
	var REMOVE = 3;

	/**
	 * dift
	 */

	function dift(prev, next, effect, key) {
	  var pStartIdx = 0;
	  var nStartIdx = 0;
	  var pEndIdx = prev.length - 1;
	  var nEndIdx = next.length - 1;
	  var pStartItem = prev[pStartIdx];
	  var nStartItem = next[nStartIdx];

	  // List head is the same
	  while (pStartIdx <= pEndIdx && nStartIdx <= nEndIdx && equal(pStartItem, nStartItem)) {
	    effect(UPDATE, pStartItem, nStartItem, nStartIdx);
	    pStartItem = prev[++pStartIdx];
	    nStartItem = next[++nStartIdx];
	  }

	  // The above case is orders of magnitude more common than the others, so fast-path it
	  if (nStartIdx > nEndIdx && pStartIdx > pEndIdx) {
	    return;
	  }

	  var pEndItem = prev[pEndIdx];
	  var nEndItem = next[nEndIdx];
	  var movedFromFront = 0;

	  // Reversed
	  while (pStartIdx <= pEndIdx && nStartIdx <= nEndIdx && equal(pStartItem, nEndItem)) {
	    effect(MOVE, pStartItem, nEndItem, pEndIdx - movedFromFront + 1);
	    pStartItem = prev[++pStartIdx];
	    nEndItem = next[--nEndIdx];
	    ++movedFromFront;
	  }

	  // Reversed the other way (in case of e.g. reverse and append)
	  while (pEndIdx >= pStartIdx && nStartIdx <= nEndIdx && equal(nStartItem, pEndItem)) {
	    effect(MOVE, pEndItem, nStartItem, nStartIdx);
	    pEndItem = prev[--pEndIdx];
	    nStartItem = next[++nStartIdx];
	    --movedFromFront;
	  }

	  // List tail is the same
	  while (pEndIdx >= pStartIdx && nEndIdx >= nStartIdx && equal(pEndItem, nEndItem)) {
	    effect(UPDATE, pEndItem, nEndItem, nEndIdx);
	    pEndItem = prev[--pEndIdx];
	    nEndItem = next[--nEndIdx];
	  }

	  if (pStartIdx > pEndIdx) {
	    while (nStartIdx <= nEndIdx) {
	      effect(CREATE, null, nStartItem, nStartIdx);
	      nStartItem = next[++nStartIdx];
	    }

	    return;
	  }

	  if (nStartIdx > nEndIdx) {
	    while (pStartIdx <= pEndIdx) {
	      effect(REMOVE, pStartItem);
	      pStartItem = prev[++pStartIdx];
	    }

	    return;
	  }

	  var created = 0;
	  var pivotDest = null;
	  var pivotIdx = pStartIdx - movedFromFront;
	  var keepBase = pStartIdx;
	  var keep = (0, _bitVector.createBv)(pEndIdx - pStartIdx);

	  var prevMap = keyMap(prev, pStartIdx, pEndIdx + 1, key);

	  for (; nStartIdx <= nEndIdx; nStartItem = next[++nStartIdx]) {
	    var oldIdx = prevMap[key(nStartItem)];

	    if (isUndefined(oldIdx)) {
	      effect(CREATE, null, nStartItem, pivotIdx++);
	      ++created;
	    } else if (pStartIdx !== oldIdx) {
	      (0, _bitVector.setBit)(keep, oldIdx - keepBase);
	      effect(MOVE, prev[oldIdx], nStartItem, pivotIdx++);
	    } else {
	      pivotDest = nStartIdx;
	    }
	  }

	  if (pivotDest !== null) {
	    (0, _bitVector.setBit)(keep, 0);
	    effect(MOVE, prev[pStartIdx], next[pivotDest], pivotDest);
	  }

	  // If there are no creations, then you have to
	  // remove exactly max(prevLen - nextLen, 0) elements in this
	  // diff. You have to remove one more for each element
	  // that was created. This means once we have
	  // removed that many, we can stop.
	  var necessaryRemovals = prev.length - next.length + created;
	  for (var removals = 0; removals < necessaryRemovals; pStartItem = prev[++pStartIdx]) {
	    if (!(0, _bitVector.getBit)(keep, pStartIdx - keepBase)) {
	      effect(REMOVE, pStartItem);
	      ++removals;
	    }
	  }

	  function equal(a, b) {
	    return key(a) === key(b);
	  }
	}

	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	function keyMap(items, start, end, key) {
	  var map = {};

	  for (var i = start; i < end; ++i) {
	    map[key(items[i])] = i;
	  }

	  return map;
	}

	/**
	 * Exports
	 */

	exports.default = dift;
	exports.CREATE = CREATE;
	exports.UPDATE = UPDATE;
	exports.MOVE = MOVE;
	exports.REMOVE = REMOVE;


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Use typed arrays if we can
	 */

	var FastArray = typeof Uint32Array === 'undefined' ? Array : Uint32Array;

	/**
	 * Bit vector
	 */

	function createBv(sizeInBits) {
	  return new FastArray(Math.ceil(sizeInBits / 32));
	}

	function setBit(v, idx) {
	  var r = idx % 32;
	  var pos = (idx - r) / 32;

	  v[pos] |= 1 << r;
	}

	function clearBit(v, idx) {
	  var r = idx % 32;
	  var pos = (idx - r) / 32;

	  v[pos] &= ~(1 << r);
	}

	function getBit(v, idx) {
	  var r = idx % 32;
	  var pos = (idx - r) / 32;

	  return !!(v[pos] & 1 << r);
	}

	/**
	 * Exports
	 */

	exports.createBv = createBv;
	exports.setBit = setBit;
	exports.clearBit = clearBit;
	exports.getBit = getBit;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var curryN = __webpack_require__(15);

	function isString(s) { return typeof s === 'string'; }
	function isNumber(n) { return typeof n === 'number'; }
	function isBoolean(b) { return typeof b === 'boolean'; }
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	function isFunction(f) { return typeof f === 'function'; }
	var isArray = Array.isArray || function(a) { return 'length' in a; };

	var mapConstrToFn = function(group, constr) {
	  return constr === String    ? isString
	       : constr === Number    ? isNumber
	       : constr === Boolean   ? isBoolean
	       : constr === Object    ? isObject
	       : constr === Array     ? isArray
	       : constr === Function  ? isFunction
	       : constr === undefined ? group
	                              : constr;
	};

	function Constructor(group, name, validators) {
	  return curryN(validators.length, function() {
	    var val = [], validator, i, v;
	    if (Type.disableChecking === true) {
	      for (i = 0; i < arguments.length; ++i) val[i] = arguments[i];
	    } else {
	      for (i = 0; i < arguments.length; ++i) {
	        v = arguments[i];
	        validator = mapConstrToFn(group, validators[i]);
	        if ((typeof validator === 'function' && validator(v)) ||
	            (v !== undefined && v !== null && v.of === validator)) {
	          val[i] = v;
	        } else {
	          throw new TypeError('wrong value ' + v + ' passed to location ' + i + ' in ' + name);
	        }
	      }
	    }
	    val.of = group;
	    val.name = name;
	    return val;
	  });
	}

	function rawCase(type, cases, action, arg) {
	  if (type !== action.of) throw new TypeError('wrong type passed to case');
	  var name = action.name in cases ? action.name
	           : '_' in cases         ? '_'
	                                  : undefined;
	  if (name === undefined) {
	    throw new Error('unhandled value passed to case');
	  } else {
	    var args = name === "_" ? [arg]
	             : arg !== undefined ? action.concat([arg])
	             : action

	    return cases[name].apply(undefined, args);
	  }
	}

	var typeCase = curryN(3, rawCase);
	var caseOn = curryN(4, rawCase);

	function Type(desc) {
	  var obj = {};
	  for (var key in desc) {
	    obj[key] = Constructor(obj, key, desc[key]);
	  }
	  obj.case = typeCase(obj);
	  obj.caseOn = caseOn(obj);
	  return obj;
	}

	Type.disableChecking = process !== undefined && process.env.NODE_ENV === 'production';

	module.exports = Type;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 14 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(16);
	var _curryN = __webpack_require__(18);
	var arity = __webpack_require__(19);


	/**
	 * Returns a curried equivalent of the provided function, with the
	 * specified arity. The curried function has two unusual capabilities.
	 * First, its arguments needn't be provided one at a time. If `g` is
	 * `R.curryN(3, f)`, the following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value `R.__` may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is `R.__`,
	 * the following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig Number -> (* -> a) -> (* -> a)
	 * @param {Number} length The arity for the returned function.
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curry
	 * @example
	 *
	 *      var addFourNumbers = function() {
	 *        return R.sum([].slice.call(arguments, 0, 4));
	 *      };
	 *
	 *      var curriedAddFourNumbers = R.curryN(4, addFourNumbers);
	 *      var f = curriedAddFourNumbers(1, 2);
	 *      var g = f(3);
	 *      g(4); //=> 10
	 */
	module.exports = _curry2(function curryN(length, fn) {
	  return arity(length, _curryN(length, [], fn));
	});


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(17);


	/**
	 * Optimized internal two-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry2(fn) {
	  return function f2(a, b) {
	    var n = arguments.length;
	    if (n === 0) {
	      return f2;
	    } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
	      return f2;
	    } else if (n === 1) {
	      return _curry1(function(b) { return fn(a, b); });
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true &&
	                          b != null && b['@@functional/placeholder'] === true) {
	      return f2;
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
	      return _curry1(function(a) { return fn(a, b); });
	    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
	      return _curry1(function(b) { return fn(a, b); });
	    } else {
	      return fn(a, b);
	    }
	  };
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * Optimized internal two-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry1(fn) {
	  return function f1(a) {
	    if (arguments.length === 0) {
	      return f1;
	    } else if (a != null && a['@@functional/placeholder'] === true) {
	      return f1;
	    } else {
	      return fn(a);
	    }
	  };
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var arity = __webpack_require__(19);


	/**
	 * Internal curryN function.
	 *
	 * @private
	 * @category Function
	 * @param {Number} length The arity of the curried function.
	 * @return {array} An array of arguments received thus far.
	 * @param {Function} fn The function to curry.
	 */
	module.exports = function _curryN(length, received, fn) {
	  return function() {
	    var combined = [];
	    var argsIdx = 0;
	    var left = length;
	    var combinedIdx = 0;
	    while (combinedIdx < received.length || argsIdx < arguments.length) {
	      var result;
	      if (combinedIdx < received.length &&
	          (received[combinedIdx] == null ||
	           received[combinedIdx]['@@functional/placeholder'] !== true ||
	           argsIdx >= arguments.length)) {
	        result = received[combinedIdx];
	      } else {
	        result = arguments[argsIdx];
	        argsIdx += 1;
	      }
	      combined[combinedIdx] = result;
	      if (result == null || result['@@functional/placeholder'] !== true) {
	        left -= 1;
	      }
	      combinedIdx += 1;
	    }
	    return left <= 0 ? fn.apply(this, combined) : arity(left, _curryN(length, combined, fn));
	  };
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(16);


	/**
	 * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
	 * parameters. Unlike `nAry`, which passes only `n` arguments to the wrapped function,
	 * functions produced by `arity` will pass all provided arguments to the wrapped function.
	 *
	 * @func
	 * @memberOf R
	 * @sig (Number, (* -> *)) -> (* -> *)
	 * @category Function
	 * @param {Number} n The desired arity of the returned function.
	 * @param {Function} fn The function to wrap.
	 * @return {Function} A new function wrapping `fn`. The new function is
	 *         guaranteed to be of arity `n`.
	 * @deprecated since v0.15.0
	 * @example
	 *
	 *      var takesTwoArgs = function(a, b) {
	 *        return [a, b];
	 *      };
	 *      takesTwoArgs.length; //=> 2
	 *      takesTwoArgs(1, 2); //=> [1, 2]
	 *
	 *      var takesOneArg = R.arity(1, takesTwoArgs);
	 *      takesOneArg.length; //=> 1
	 *      // All arguments are passed through to the wrapped function
	 *      takesOneArg(1, 2); //=> [1, 2]
	 */
	module.exports = _curry2(function(n, fn) {
	  // jshint unused:vars
	  switch (n) {
	    case 0: return function() {return fn.apply(this, arguments);};
	    case 1: return function(a0) {return fn.apply(this, arguments);};
	    case 2: return function(a0, a1) {return fn.apply(this, arguments);};
	    case 3: return function(a0, a1, a2) {return fn.apply(this, arguments);};
	    case 4: return function(a0, a1, a2, a3) {return fn.apply(this, arguments);};
	    case 5: return function(a0, a1, a2, a3, a4) {return fn.apply(this, arguments);};
	    case 6: return function(a0, a1, a2, a3, a4, a5) {return fn.apply(this, arguments);};
	    case 7: return function(a0, a1, a2, a3, a4, a5, a6) {return fn.apply(this, arguments);};
	    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) {return fn.apply(this, arguments);};
	    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {return fn.apply(this, arguments);};
	    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {return fn.apply(this, arguments);};
	    default: throw new Error('First argument to arity must be a non-negative integer no greater than ten');
	  }
	});


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.render = undefined;

	var _renderString = __webpack_require__(21);

	var render = _renderString.renderString;

	exports.render = render;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.renderString = renderString;

	var _element = __webpack_require__(8);

	/**
	 * Turn an object of key/value pairs into a HTML attribute string. This
	 * function is responsible for what attributes are allowed to be rendered and
	 * should handle any other special cases specific to deku.
	 */

	function attributesToString(attributes) {
	  var str = '';
	  for (var name in attributes) {
	    var value = attributes[name];
	    if (name === 'innerHTML') continue;
	    if ((0, _element.isValidAttribute)(value)) str += ' ' + name + '="' + attributes[name] + '"';
	  }
	  return str;
	}

	/**
	 * Render a virtual element to a string. You can pass in an option state context
	 * object that will be given to all components.
	 */

	function renderString(element, context) {
	  var path = arguments.length <= 2 || arguments[2] === undefined ? '0' : arguments[2];

	  if ((0, _element.isText)(element)) {
	    return element.nodeValue;
	  }

	  if ((0, _element.isThunk)(element)) {
	    var props = element.props;
	    var component = element.component;
	    var _children = element.children;
	    var render = component.render;

	    var output = render({
	      children: _children,
	      props: props,
	      path: path,
	      context: context
	    });
	    return renderString(output, context, path);
	  }

	  var attributes = element.attributes;
	  var type = element.type;
	  var children = element.children;

	  var innerHTML = attributes.innerHTML;
	  var str = '<' + type + attributesToString(attributes) + '>';

	  if (innerHTML) {
	    str += innerHTML;
	  } else {
	    str += children.map(function (child, i) {
	      return renderString(child, context, path + '.' + (child.key == null ? i : child.key));
	    }).join('');
	  }

	  str += '</' + type + '>';
	  return str;
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.patch = exports.createElement = exports.createRenderer = undefined;

	var _createRenderer = __webpack_require__(23);

	var _createRenderer2 = _interopRequireDefault(_createRenderer);

	var _createElement = __webpack_require__(24);

	var _createElement2 = _interopRequireDefault(_createElement);

	var _patch = __webpack_require__(31);

	var _patch2 = _interopRequireDefault(_patch);

	var _mountElement = __webpack_require__(30);
	var _mountElement2 = _interopRequireDefault(_mountElement);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.createRenderer = _createRenderer2.default;
	exports.createElement = _createElement2.default;
	exports.mountElement = _mountElement2.default;
	exports.patch = _patch2.default;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createDOMRenderer;

	var _createElement = __webpack_require__(24);

	var _createElement2 = _interopRequireDefault(_createElement);

	var mountElement = __webpack_require__(30);

	var _diff = __webpack_require__(7);

	var _patch = __webpack_require__(31);

	var _patch2 = _interopRequireDefault(_patch);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * Create a DOM renderer using a container element. Everything will be rendered
	 * inside of that container. Returns a function that accepts new state that can
	 * replace what is currently rendered.
	 */

	function createDOMRenderer(container, dispatch) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var oldVnode = null;
	  var node = null;
	  var rootId = options.id || '0';

	  if (container && container.childNodes.length > 0) {
	    container.innerHTML = '';
	  }

	  var update = function update(newVnode, context) {

	    var changes = (0, _diff.diffNode)(oldVnode, newVnode, rootId);

	    node = changes.reduce((0, _patch2.default)(dispatch, context), node);
	    oldVnode = newVnode;
	    return node;
	  };

	  var create = function create(vnode, context) {
	    node = (0, _createElement2.default)(vnode, rootId, dispatch, context);
	    if (container) container.appendChild(node);
	    mountElement(vnode);
	    oldVnode = vnode;
	    return node;
	  };

	  return function (vnode) {
	    var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    return node !== null ? update(vnode, context) : create(vnode, context);
	  };
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createElement;

	var _element = __webpack_require__(8);
	var _setAttribute = __webpack_require__(25);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var cache = {};

	/**
	 * Create a real DOM element from a virtual element, recursively looping down.
	 * When it finds custom elements it will render them, cache them, and keep going,
	 * so they are treated like any other native element.
	 */

	function createElement(vnode, path, dispatch, context) {

	  //设置上下文
	  vnode.context = context;
	  //给ref符值
	  // if(vnode.attributes&&vnode.attributes["ref"]&&vnode.componentContext&&vnode.componentContext.refs){
	  //         vnode.componentContext.refs[vnode.attributes["ref"]] = vnode.component || vnode
	  // }

	  if ((0, _element.isText)(vnode)) {
	    var value = typeof vnode.nodeValue === 'string' || typeof vnode.nodeValue === 'number' ? vnode.nodeValue : '';
	    return vnode.nativeNode || document.createTextNode(value);
	  }

	  if ((0, _element.isThunk)(vnode)) {

	    var component = vnode.component;
	    var children = component.children;
	    var props = component.props;
	    var type = component.type || "div";
	    component.ovnode = vnode;

	    //  为了元素增加一个包装原始

	    var childrenWrap = _element.create("children", {}, children);
	    component.children = children;
	    component.content = childrenWrap;

	    //生成ref引用
	    var model = {
	      children: children,
	      props: props,
	      path: path,
	      dispatch: dispatch,
	      context: context
	    };

	    if (component.componentWillMount) {
	      component.componentWillMount();
	    }

	    var oldNativeNode;
	    if (vnode.nativeNode) {
	      oldNativeNode = vnode.nativeNode;
	    }

	    var output = component.render(model);
	    var _DOMElement;
	    if (output) {

	      if (oldNativeNode) {

	        _DOMElement = oldNativeNode;
	      } else {

	        _DOMElement = createElement(output, (0, _element.createPath)(path, output.key || '0'), dispatch, vnode);

	        if (vnode.attributes["id"]) {
	          (0, _setAttribute.setAttribute)(_DOMElement, "id", vnode.attributes["id"]);
	        }
	        if (vnode.attributes["key"]) {
	          (0, _setAttribute.setAttribute)(_DOMElement, "key", vnode.attributes["key"]);
	        }
	      }
	    }

	    //保留输出，setState，进行对比
	    component.vnode = output;

	    component.node = _DOMElement;
	    component.path = path;

	    component.nativeNode = _DOMElement;
	    vnode.nativeNode = _DOMElement;
	    _DOMElement.__upgraded__ = true;

	    // if (component.onCreate) component.onCreate(model);
	    // if(component.componentDidMount){
	    //   component.componentDidMount();
	    // }

	    _DOMElement.vnode = vnode;

	    return _DOMElement;
	  }

	  if (vnode.nativeNode) {
	    return vnode.nativeNode;
	  }
	  var cached = cache[vnode.type];

	  if (typeof cached === 'undefined') {
	    cached = cache[vnode.type] = document.createElement(vnode.type);
	  }

	  var DOMElement = cached.cloneNode(false);

	  for (var name in vnode.attributes) {
	    (0, _setAttribute.setAttribute)(DOMElement, name, vnode.attributes[name]);
	  }

	  vnode.children.forEach(function (node, index) {
	    if (node === null || node === undefined) {
	      return;
	    }
	    var child = createElement(node, (0, _element.createPath)(path, node.key || index), dispatch, context);
	    DOMElement.appendChild(child);
	  });
	  vnode.nativeNode = DOMElement;
	  DOMElement.vnode = vnode;

	  return DOMElement;
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeAttribute = removeAttribute;
	exports.setAttribute = setAttribute;

	var _element = __webpack_require__(8);

	var _indexOf = __webpack_require__(26);

	var _indexOf2 = _interopRequireDefault(_indexOf);

	var _setify = __webpack_require__(27);

	var _setify2 = _interopRequireDefault(_setify);

	var _events = __webpack_require__(29);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function removeAttribute(DOMElement, name, previousValue) {
	  var eventType = _events2.default[name];
	  if (eventType) {
	    if (typeof previousValue === 'function') {
	      DOMElement.removeEventListener(eventType, previousValue);
	    }
	    return;
	  }
	  switch (name) {
	    case 'checked':
	    case 'disabled':
	    case 'selected':
	      DOMElement[name] = false;
	      break;
	    case 'innerHTML':
	    case 'nodeValue':
	      DOMElement.innerHTML = '';
	      break;
	    case 'value':
	      DOMElement.value = '';
	      break;
	    default:
	      DOMElement.removeAttribute(name);
	      break;
	  }
	}

	function setAttribute(DOMElement, name, value, previousValue) {
	  var eventType = _events2.default[name];
	  if (value === previousValue) {
	    return;
	  }
	  if (eventType) {
	    if (typeof previousValue === 'function') {
	      DOMElement.removeEventListener(eventType, previousValue);
	    }
	    DOMElement.addEventListener(eventType, value);
	    return;
	  }
	  if (!(0, _element.isValidAttribute)(value)) {
	    removeAttribute(DOMElement, name, previousValue);
	    return;
	  }
	  switch (name) {
	    case 'checked':
	    case 'disabled':
	    case 'innerHTML':
	    case 'nodeValue':
	      DOMElement[name] = value;
	      break;
	    case 'selected':
	      DOMElement.selected = value;
	      // Fix for IE/Safari where select is not correctly selected on change
	      if (DOMElement.tagName === 'OPTION' && DOMElement.parentNode) {
	        var select = DOMElement.parentNode;
	        select.selectedIndex = (0, _indexOf2.default)(select.options, DOMElement);
	      }
	      break;
	    case 'value':
	      (0, _setify2.default)(DOMElement, value);
	      break;
	    default:
	      DOMElement.setAttribute(name, value);
	      break;
	  }
	}

/***/ },
/* 26 */
/***/ function(module, exports) {

	/*!
	 * index-of <https://github.com/jonschlinkert/index-of>
	 *
	 * Copyright (c) 2014-2015 Jon Schlinkert.
	 * Licensed under the MIT license.
	 */

	'use strict';

	module.exports = function indexOf(arr, ele, start) {
	  start = start || 0;
	  var idx = -1;

	  if (arr == null) return idx;
	  var len = arr.length;
	  var i = start < 0
	    ? (len + start)
	    : start;

	  if (i >= arr.length) {
	    return -1;
	  }

	  while (i < len) {
	    if (arr[i] === ele) {
	      return i;
	    }
	    i++;
	  }

	  return -1;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var naturalSelection = __webpack_require__(28);

	module.exports = function(element, value){
	    var canSet = naturalSelection(element) && element === document.activeElement;

	    if (canSet) {
	        var start = element.selectionStart,
	            end = element.selectionEnd;

	        element.value = value;
	        element.setSelectionRange(start, end);
	    } else {
	        element.value = value;
	    }
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	var supportedTypes = ['text', 'search', 'tel', 'url', 'password'];

	module.exports = function(element){
	    return !!(element.setSelectionRange && ~supportedTypes.indexOf(element.type));
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Special attributes that map to DOM events.
	 */

	exports.default = {
	  onAbort: 'abort',
	  onAnimationStart: 'animationstart',
	  onAnimationIteration: 'animationiteration',
	  onAnimationEnd: 'animationend',
	  onBlur: 'blur',
	  onCanPlay: 'canplay',
	  onCanPlayThrough: 'canplaythrough',
	  onChange: 'change',
	  onClick: 'click',
	  onContextMenu: 'contextmenu',
	  onCopy: 'copy',
	  onCut: 'cut',
	  onDoubleClick: 'dblclick',
	  onDrag: 'drag',
	  onDragEnd: 'dragend',
	  onDragEnter: 'dragenter',
	  onDragExit: 'dragexit',
	  onDragLeave: 'dragleave',
	  onDragOver: 'dragover',
	  onDragStart: 'dragstart',
	  onDrop: 'drop',
	  onDurationChange: 'durationchange',
	  onEmptied: 'emptied',
	  onEncrypted: 'encrypted',
	  onEnded: 'ended',
	  onError: 'error',
	  onFocus: 'focus',
	  onInput: 'input',
	  onInvalid: 'invalid',
	  onKeyDown: 'keydown',
	  onKeyPress: 'keypress',
	  onKeyUp: 'keyup',
	  onLoad: 'load',
	  onLoadedData: 'loadeddata',
	  onLoadedMetadata: 'loadedmetadata',
	  onLoadStart: 'loadstart',
	  onPause: 'pause',
	  onPlay: 'play',
	  onPlaying: 'playing',
	  onProgress: 'progress',
	  onMouseDown: 'mousedown',
	  onMouseEnter: 'mouseenter',
	  onMouseLeave: 'mouseleave',
	  onMouseMove: 'mousemove',
	  onMouseOut: 'mouseout',
	  onMouseOver: 'mouseover',
	  onMouseUp: 'mouseup',
	  onPaste: 'paste',
	  onRateChange: 'ratechange',
	  onReset: 'reset',
	  onScroll: 'scroll',
	  onSeeked: 'seeked',
	  onSeeking: 'seeking',
	  onSubmit: 'submit',
	  onStalled: 'stalled',
	  onSuspend: 'suspend',
	  onTimeUpdate: 'timeupdate',
	  onTransitionEnd: 'transitionend',
	  onTouchCancel: 'touchcancel',
	  onTouchEnd: 'touchend',
	  onTouchMove: 'touchmove',
	  onTouchStart: 'touchstart',
	  onVolumeChange: 'volumechange',
	  onWaiting: 'waiting',
	  onWheel: 'wheel'
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _element = __webpack_require__(8);
	function mountElement(vnode) {

	  if ((0, _element.isThunk)(vnode)) {

	    var component = vnode.component;
	    //保留输出，setState，进行对比
	    var output = component.vnode;
	    output.children.forEach(function (node, index) {
	      if (node === null || node === undefined) {
	        return;
	      }
	      var child = mountElement(node);
	    });

	    if (component.onCreate) component.onCreate();
	    if (component.componentDidMount) {
	      component.componentDidMount();
	    }
	  } else {
	    var children = vnode.children;
	    if (children) {
	      children.forEach(function (node, index) {
	        if (node === null || node === undefined) {
	          return;
	        }
	        var child = mountElement(node);
	      });
	    }
	  }
	}

	module.exports = mountElement;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.insertAtIndex = undefined;
	exports.default = patch;

	var _setAttribute2 = __webpack_require__(25);

	var _element = __webpack_require__(8);

	var _createElement = __webpack_require__(24);

	var _createElement2 = _interopRequireDefault(_createElement);

	var _diff = __webpack_require__(7);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * Modify a DOM element given an array of actions. A context can be set
	 * that will be used to render any custom elements.
	 */

	function patch(dispatch, context) {
	  return function (DOMElement, action) {
	    _diff.Actions.case({
	      setAttribute: function setAttribute(name, value, previousValue) {
	        (0, _setAttribute2.setAttribute)(DOMElement, name, value, previousValue);
	      },
	      removeAttribute: function removeAttribute(name, previousValue) {
	        (0, _setAttribute2.removeAttribute)(DOMElement, name, previousValue);
	      },
	      insertBefore: function insertBefore(index) {
	        insertAtIndex(DOMElement.parentNode, index, DOMElement);
	      },
	      sameNode: function sameNode() {},
	      updateChildren: function updateChildren(changes) {
	        // Create a clone of the children so we can reference them later
	        // using their original position even if they move around
	        var childNodes = Array.prototype.slice.apply(DOMElement.childNodes);

	        changes.forEach(function (change) {
	          _diff.Actions.case({
	            insertChild: function insertChild(vnode, index, path) {
	              insertAtIndex(DOMElement, index, (0, _createElement2.default)(vnode, path, dispatch, context));
	            },
	            removeChild: function removeChild(index) {

	              DOMElement.removeChild(childNodes[index]);
	            },
	            updateChild: function updateChild(index, actions) {
	              var update = patch(dispatch, context);
	              actions.forEach(function (action) {
	                return update(childNodes[index], action);
	              });
	            }
	          }, change);
	        });
	      },
	      updateThunk: function updateThunk(prev, next, path) {

	        var component = next.component;
	        var props = component.props;
	        var children = component.children;

	        var prevNode = prev.vnode;
	        var model = {
	          children: children,
	          props: props,
	          path: path,
	          dispatch: dispatch,
	          context: context
	        };
	        if (component.componentWillUpdate) {
	          component.componentWillUpdate();
	        }
	        var nextNode = component.render(model);
	        var changes = (0, _diff.diffNode)(prevNode, nextNode, (0, _element.createPath)(path, '0'));
	        DOMElement = changes.reduce(patch(dispatch, context), DOMElement);
	        if (component.onUpdate) component.onUpdate(model);

	        if (component.componentDidUpdate) {
	          component.componentDidUpdate();
	        }
	      },
	      replaceNode: function replaceNode(prev, next, path) {
	        var newEl = (0, _createElement2.default)(next, path, dispatch, context);
	        var parentEl = DOMElement.parentNode;
	        if (parentEl) parentEl.replaceChild(newEl, DOMElement);
	        DOMElement = newEl;
	        removeThunks(prev);
	      },
	      removeNode: function removeNode(prev) {
	        removeThunks(prev);
	        DOMElement.parentNode.removeChild(DOMElement);
	        DOMElement = null;
	      }
	    }, action);

	    return DOMElement;
	  };
	}

	/**
	 * Recursively remove all thunks
	 */

	function removeThunks(vnode) {

	  while ((0, _element.isThunk)(vnode)) {
	    var _vnode = vnode;
	    var component = _vnode.component;

	    if (component.componentWillUnmount) {
	      component.componentWillUnmount();
	    }
	    vnode = component.vnode;
	  }

	  if (vnode.children) {
	    for (var i = 0; i < vnode.children.length; i++) {
	      removeThunks(vnode.children[i]);
	    }
	  }
	}

	/**
	 * Slightly nicer insertBefore
	 */

	var insertAtIndex = exports.insertAtIndex = function insertAtIndex(parent, index, el) {
	  var target = parent.childNodes[index];
	  if (target) {
	    parent.insertBefore(el, target);
	  } else {
	    parent.appendChild(el);
	  }
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (url, complete) {
	  if (jQuery) {
	    jQuery.getScript(url, complete);
	  } else {
	    console.error("不存在getScript方法");
	  }
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var CSSPropertyOperations = __webpack_require__(34);

	var ObjectToCssText = function ObjectToCssText(styles, mediaQuery) {
	  var cssText = "";
	  for (var selector in styles) {
	    cssText += selector + "{" + CSSPropertyOperations.createMarkupForStyles(styles[selector]) + "}";
	  }

	  if (mediaQuery) {
	    cssText = mediaQuery + "{" + cssText + "}";
	  }

	  return cssText;
	};
	var head;

	var StyleSheet = {
	  create: function create(styles, mediaQuery) {
	    if (!head) {
	      head = document.getElementsByTagName("head")[0];
	    }

	    var style = document.createElement("style");
	    var cssText = ObjectToCssText(styles, mediaQuery);
	    style.innerText = cssText;
	    head.appendChild(style);
	  }
	};

	module.exports = StyleSheet;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule CSSPropertyOperations
	 * @typechecks static-only
	 */

	'use strict';

	var CSSProperty = __webpack_require__(35);

	var camelizeStyleName = __webpack_require__(36);
	var dangerousStyleValue = __webpack_require__(37);
	var hyphenateStyleName = __webpack_require__(39);

	/**
	 * Memoizes the return value of a function that accepts one string argument.
	 *
	 * @param {function} callback
	 * @return {function}
	 */
	function memoizeStringOnly(callback) {
	  var cache = {};
	  return function (string) {
	    if (!cache.hasOwnProperty(string)) {
	      cache[string] = callback.call(this, string);
	    }
	    return cache[string];
	  };
	}
	var warning = console.warn;

	var processStyleName = memoizeStringOnly(function (styleName) {
	  return hyphenateStyleName(styleName);
	});

	var hasShorthandPropertyBug = false;
	var styleFloatAccessor = 'cssFloat';

	var tempStyle = document.createElement('div').style;
	try {
	  // IE8 throws "Invalid argument." if resetting shorthand style properties.
	  tempStyle.font = '';
	} catch (e) {
	  hasShorthandPropertyBug = true;
	}
	// IE8 only supports accessing cssFloat (standard) as styleFloat
	if (document.documentElement.style.cssFloat === undefined) {
	  styleFloatAccessor = 'styleFloat';
	}

	/**
	 * Operations for dealing with CSS properties.
	 */
	var CSSPropertyOperations = {

	  /**
	   * Serializes a mapping of style properties for use as inline styles:
	   *
	   *   > createMarkupForStyles({width: '200px', height: 0})
	   *   "width:200px;height:0;"
	   *
	   * Undefined values are ignored so that declarative programming is easier.
	   * The result should be HTML-escaped before insertion into the DOM.
	   *
	   * @param {object} styles
	   * @return {?string}
	   */
	  createMarkupForStyles: function createMarkupForStyles(styles) {
	    var serialized = '';
	    for (var styleName in styles) {
	      if (!styles.hasOwnProperty(styleName)) {
	        continue;
	      }
	      var styleValue = styles[styleName];

	      if (styleValue != null) {
	        serialized += processStyleName(styleName) + ':';
	        serialized += dangerousStyleValue(styleName, styleValue) + ';';
	      }
	    }
	    return serialized || null;
	  },

	  /**
	   * Sets the value for multiple styles on a node.  If a value is specified as
	   * '' (empty string), the corresponding style property will be unset.
	   *
	   * @param {DOMElement} node
	   * @param {object} styles
	   */
	  setValueForStyles: function setValueForStyles(node, styles) {
	    var style = node.style;
	    for (var styleName in styles) {
	      if (!styles.hasOwnProperty(styleName)) {
	        continue;
	      }
	      if (process.env.NODE_ENV !== 'production') {
	        warnValidStyle(styleName, styles[styleName]);
	      }
	      var styleValue = dangerousStyleValue(styleName, styles[styleName]);
	      if (styleName === 'float') {
	        styleName = styleFloatAccessor;
	      }
	      if (styleValue) {
	        style[styleName] = styleValue;
	      } else {
	        var expansion = hasShorthandPropertyBug && CSSProperty.shorthandPropertyExpansions[styleName];
	        if (expansion) {
	          // Shorthand property that IE8 won't like unsetting, so unset each
	          // component to placate it
	          for (var individualStyleName in expansion) {
	            style[individualStyleName] = '';
	          }
	        } else {
	          style[styleName] = '';
	        }
	      }
	    }
	  }

	};

	module.exports = CSSPropertyOperations;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule CSSProperty
	 */

	'use strict';

	/**
	 * CSS properties which accept numbers but are not in units of "px".
	 */

	var isUnitlessNumber = {
	  animationIterationCount: true,
	  boxFlex: true,
	  boxFlexGroup: true,
	  boxOrdinalGroup: true,
	  columnCount: true,
	  flex: true,
	  flexGrow: true,
	  flexPositive: true,
	  flexShrink: true,
	  flexNegative: true,
	  flexOrder: true,
	  fontWeight: true,
	  lineClamp: true,
	  lineHeight: true,
	  opacity: true,
	  order: true,
	  orphans: true,
	  tabSize: true,
	  widows: true,
	  zIndex: true,
	  zoom: true,

	  // SVG-related properties
	  fillOpacity: true,
	  stopOpacity: true,
	  strokeDashoffset: true,
	  strokeOpacity: true,
	  strokeWidth: true
	};

	/**
	 * @param {string} prefix vendor-specific prefix, eg: Webkit
	 * @param {string} key style name, eg: transitionDuration
	 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
	 * WebkitTransitionDuration
	 */
	function prefixKey(prefix, key) {
	  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
	}

	/**
	 * Support style names that may come passed in prefixed by adding permutations
	 * of vendor prefixes.
	 */
	var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

	// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
	// infinite loop, because it iterates over the newly added props too.
	Object.keys(isUnitlessNumber).forEach(function (prop) {
	  prefixes.forEach(function (prefix) {
	    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
	  });
	});

	/**
	 * Most style properties can be unset by doing .style[prop] = '' but IE8
	 * doesn't like doing that with shorthand properties so for the properties that
	 * IE8 breaks on, which are listed here, we instead unset each of the
	 * individual properties. See http://bugs.jquery.com/ticket/12385.
	 * The 4-value 'clock' properties like margin, padding, border-width seem to
	 * behave without any problems. Curiously, list-style works too without any
	 * special prodding.
	 */
	var shorthandPropertyExpansions = {
	  background: {
	    backgroundAttachment: true,
	    backgroundColor: true,
	    backgroundImage: true,
	    backgroundPositionX: true,
	    backgroundPositionY: true,
	    backgroundRepeat: true
	  },
	  backgroundPosition: {
	    backgroundPositionX: true,
	    backgroundPositionY: true
	  },
	  border: {
	    borderWidth: true,
	    borderStyle: true,
	    borderColor: true
	  },
	  borderBottom: {
	    borderBottomWidth: true,
	    borderBottomStyle: true,
	    borderBottomColor: true
	  },
	  borderLeft: {
	    borderLeftWidth: true,
	    borderLeftStyle: true,
	    borderLeftColor: true
	  },
	  borderRight: {
	    borderRightWidth: true,
	    borderRightStyle: true,
	    borderRightColor: true
	  },
	  borderTop: {
	    borderTopWidth: true,
	    borderTopStyle: true,
	    borderTopColor: true
	  },
	  font: {
	    fontStyle: true,
	    fontVariant: true,
	    fontWeight: true,
	    fontSize: true,
	    lineHeight: true,
	    fontFamily: true
	  },
	  outline: {
	    outlineWidth: true,
	    outlineStyle: true,
	    outlineColor: true
	  }
	};

	var CSSProperty = {
	  isUnitlessNumber: isUnitlessNumber,
	  shorthandPropertyExpansions: shorthandPropertyExpansions
	};

	module.exports = CSSProperty;

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule camelize
	 * @typechecks
	 */

	var _hyphenPattern = /-(.)/g;

	/**
	 * Camelcases a hyphenated string, for example:
	 *
	 *   > camelize('background-color')
	 *   < "backgroundColor"
	 *
	 * @param {string} string
	 * @return {string}
	 */
	function camelize(string) {
	  return string.replace(_hyphenPattern, function (_, character) {
	    return character.toUpperCase();
	  });
	}

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule camelizeStyleName
	 * @typechecks
	 */

	var msPattern = /^-ms-/;

	/**
	 * Camelcases a hyphenated CSS property name, for example:
	 *
	 *   > camelizeStyleName('background-color')
	 *   < "backgroundColor"
	 *   > camelizeStyleName('-moz-transition')
	 *   < "MozTransition"
	 *   > camelizeStyleName('-ms-transition')
	 *   < "msTransition"
	 *
	 * As Andi Smith suggests
	 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
	 * is converted to lowercase `ms`.
	 *
	 * @param {string} string
	 * @return {string}
	 */
	function camelizeStyleName(string) {
	  return camelize(string.replace(msPattern, 'ms-'));
	}

	module.exports = camelizeStyleName;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule dangerousStyleValue
	 */

	'use strict';

	var CSSProperty = __webpack_require__(35);
	var warning = __webpack_require__(38);

	var isUnitlessNumber = CSSProperty.isUnitlessNumber;
	var styleWarnings = {};

	/**
	 * Convert a value into the proper css writable value. The style name `name`
	 * should be logical (no hyphens), as specified
	 * in `CSSProperty.isUnitlessNumber`.
	 *
	 * @param {string} name CSS property name such as `topMargin`.
	 * @param {*} value CSS property value such as `10px`.
	 * @param {ReactDOMComponent} component
	 * @return {string} Normalized style value with dimensions applied.
	 */
	function dangerousStyleValue(name, value, component) {
	  // Note that we've removed escapeTextForBrowser() calls here since the
	  // whole string will be escaped when the attribute is injected into
	  // the markup. If you provide unsafe user data here they can inject
	  // arbitrary CSS which may be problematic (I couldn't repro this):
	  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
	  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
	  // This is not an XSS hole but instead a potential CSS injection issue
	  // which has lead to a greater discussion about how we're going to
	  // trust URLs moving forward. See #2115901

	  var isEmpty = value == null || typeof value === 'boolean' || value === '';
	  if (isEmpty) {
	    return '';
	  }

	  var isNonNumeric = isNaN(value);
	  if (isNonNumeric || value === 0 || isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
	    return '' + value; // cast to string
	  }

	  if (typeof value === 'string') {
	    if (__DEV__) {
	      if (component) {
	        var owner = component._currentElement._owner;
	        var ownerName = owner ? owner.getName() : null;
	        if (ownerName && !styleWarnings[ownerName]) {
	          styleWarnings[ownerName] = {};
	        }
	        var warned = false;
	        if (ownerName) {
	          var warnings = styleWarnings[ownerName];
	          warned = warnings[name];
	          if (!warned) {
	            warnings[name] = true;
	          }
	        }
	        if (!warned) {
	          warning(false, 'a `%s` tag (owner: `%s`) was passed a numeric string value ' + 'for CSS property `%s` (value: `%s`) which will be treated ' + 'as a unitless number in a future version of React.', component._currentElement.type, ownerName || 'unknown', name, value);
	        }
	      }
	    }
	    value = value.trim();
	  }
	  return value + 'px';
	}

	module.exports = dangerousStyleValue;

/***/ },
/* 38 */
/***/ function(module, exports) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule warning
	 */

	'use strict';

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = function warning() {};

	if (window.__DEV__) {
	  warning = function warning(condition, format) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }

	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    }
	  };
	}

	module.exports = warning;

/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule hyphenateStyleName
	 * @typechecks
	 */

	'use strict';

	var _uppercasePattern = /([A-Z])/g;

	/**
	 * Hyphenates a camelcased string, for example:
	 *
	 *   > hyphenate('backgroundColor')
	 *   < "background-color"
	 *
	 * For CSS style names, use `hyphenateStyleName` instead which works properly
	 * with all vendor prefixes, including `ms`.
	 *
	 * @param {string} string
	 * @return {string}
	 */
	function hyphenate(string) {
	  return string.replace(_uppercasePattern, '-$1').toLowerCase();
	}

	var msPattern = /^ms-/;

	/**
	 * Hyphenates a camelcased CSS property name, for example:
	 *
	 *   > hyphenateStyleName('backgroundColor')
	 *   < "background-color"
	 *   > hyphenateStyleName('MozTransition')
	 *   < "-moz-transition"
	 *   > hyphenateStyleName('msTransition')
	 *   < "-ms-transition"
	 *
	 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
	 * is converted to `-ms-`.
	 *
	 * @param {string} string
	 * @return {string}
	 */
	function hyphenateStyleName(string) {
	  return hyphenate(string).replace(msPattern, '-ms-');
	}

	module.exports = hyphenateStyleName;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Register = __webpack_require__(1);

	module.exports = function (tagName, prototype) {
	  return Register.register(tagName, prototype);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	//bootstrap

	var _require = __webpack_require__(6);

	var dom = _require.dom;

	var utils = __webpack_require__(2);
	var Register = __webpack_require__(1);
	var Element = __webpack_require__(5);
	var EE = __webpack_require__(3);
	var StyleSheet = __webpack_require__(33);

	var renderDocument = function renderDocument() {
	  Register.upgradeDocument(document);
	};

	var head = document.getElementsByTagName("head")[0];
	var style = document.createElement("style");
	style.innerText = "body{opacity:0;filter:alpha(opacity=0)}";

	var isReady = false;
	var callbacks = [];
	var ready = function ready(callback) {
	  if (isReady) {
	    callback && callback();
	  } else {
	    callbacks.push(callback);
	  }
	};

	var fireReady = function fireReady() {
	  if (!isReady) return;
	  for (var i = 0; i < callbacks.length; i++) {
	    callbacks[i] && callbacks[i]();
	  }
	};

	module.exports = {
	  runApp: function runApp(compontent, container, fire) {
	    // utils.ready(function () {
	    var container = container ? container : document.body;
	    var render = dom.createRenderer(document.body);
	    var vnode = Element(compontent, {}, null);
	    Sophie.firstVnode = vnode;
	    render(vnode, container);
	    isReady = true;
	    if (fire !== false) {
	      EE.trigger("ready", [vnode]);
	      fireReady();
	    }
	    // })
	  },

	  ready: ready,

	  createVnodeByTagName: function createVnodeByTagName(name) {
	    var compontent = Register.registry[name];
	    var vnode = Element(compontent, {}, null);
	    return vnode;
	  },

	  createElementByVnode: function createElementByVnode(vnode) {

	    return dom.createElement(vnode, 0);
	  },

	  createElementByTagName: function createElementByTagName(name) {

	    var vnode = this.createVnodeByTagName(name);

	    return this.createElementByVnode(vnode);
	  }

	};

/***/ }
/******/ ]);