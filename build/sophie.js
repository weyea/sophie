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

	var _index = __webpack_require__(175);

	var Register = __webpack_require__(217);
	var Element = __webpack_require__(221);
	var mount = __webpack_require__(232);

	var Import = __webpack_require__(233);
	var StyleSheet = __webpack_require__(225);
	var Compontent = __webpack_require__(234);
	var Bootstrap = __webpack_require__(235);
	var EE = __webpack_require__(219);

	var Sophie = {
	  runApp: Bootstrap.runApp,
	  ready: Bootstrap.ready,
	  renderElement: Bootstrap.renderElement,
	  renderToJSON: Bootstrap.renderToJSON,
	  renderFromJSON: Bootstrap.renderFromJSON,
	  isBaseVnode: Bootstrap.isBaseVnode,
	  getOwner: Bootstrap.getOwner,
	  getParent: Bootstrap.getParent,
	  closestBaseParent: Bootstrap.closestBaseParent,
	  getBaseParent: Bootstrap.getBaseParent,

	  createVnodeByTagName: Bootstrap.createVnodeByTagName,

	  createElementByVnode: Bootstrap.createElementByVnode,

	  createElementByTagName: Bootstrap.createElementByTagName,

	  mountElement: mount,
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
	    return node.type === 'thunk';
	  }

	};

	window.Sophie = Sophie;
	module.exports = Sophie;

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	'use strict';

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
	    while (len) {
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

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.h = exports.dom = exports.diff = exports.vnode = exports.string = exports.element = exports.createApp = undefined;

	var _diff = __webpack_require__(176);

	var diff = _interopRequireWildcard(_diff);

	var _element = __webpack_require__(177);

	var vnode = _interopRequireWildcard(_element);

	var _string = __webpack_require__(191);

	var string = _interopRequireWildcard(_string);

	var _dom = __webpack_require__(194);

	var dom = _interopRequireWildcard(_dom);

	var _app = __webpack_require__(215);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var element = vnode.create;
	var h = vnode.create;

	exports.createApp = _app.createApp;
	exports.element = element;
	exports.string = string;
	exports.vnode = vnode;
	exports.diff = diff;
	exports.dom = dom;
	exports.h = h;

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Actions = undefined;
	exports.diffAttributes = diffAttributes;
	exports.diffChildren = diffChildren;
	exports.diffNode = diffNode;

	var _element = __webpack_require__(177);

	var _dift = __webpack_require__(183);

	var diffActions = _interopRequireWildcard(_dift);

	var _isUndefined = __webpack_require__(178);

	var _isUndefined2 = _interopRequireDefault(_isUndefined);

	var _isNull = __webpack_require__(182);

	var _isNull2 = _interopRequireDefault(_isNull);

	var _unionType = __webpack_require__(185);

	var _unionType2 = _interopRequireDefault(_unionType);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
	  var replaceNode = Actions.replaceNode;
	  var setAttribute = Actions.setAttribute;
	  var sameNode = Actions.sameNode;
	  var removeNode = Actions.removeNode;
	  var updateThunk = Actions.updateThunk;

	  // No left node to compare it to
	  // TODO: This should just return a createNode action

	  if ((0, _isUndefined2.default)(prev)) {
	    throw new Error('Left node must not be null or undefined');
	  }

	  // Bail out and skip updating this whole sub-tree
	  if (prev === next) {
	    return [sameNode()];
	  }

	  // Remove
	  if (!(0, _isUndefined2.default)(prev) && (0, _isUndefined2.default)(next)) {
	    return [removeNode(prev)];
	  }

	  // Replace with empty
	  if (!(0, _isNull2.default)(prev) && (0, _isNull2.default)(next) || (0, _isNull2.default)(prev) && !(0, _isNull2.default)(next)) {
	    return [replaceNode(prev, next, path)];
	  }

	  // Replace
	  if (prev.type !== next.type) {
	    return [replaceNode(prev, next, path)];
	  }

	  // Native
	  if ((0, _element.isNative)(next)) {
	    if (prev.tagName !== next.tagName) {
	      return [replaceNode(prev, next, path)];
	    }
	    var changes = diffAttributes(prev, next);
	    changes.push(diffChildren(prev, next, path));
	    return changes;
	  }

	  // Text
	  if ((0, _element.isText)(next)) {
	    var changes = [];
	    if (prev.nodeValue !== next.nodeValue) {
	      changes.push(setAttribute('nodeValue', next.nodeValue, prev.nodeValue));
	    }
	    return changes;
	  }

	  // Thunk
	  if ((0, _element.isThunk)(next)) {
	    var changes = [];
	    if ((0, _element.isSameThunk)(prev, next)) {
	      changes.push(updateThunk(prev, next, path));
	    } else {
	      changes.push(replaceNode(prev, next, path));
	    }
	    return changes;
	  }

	  // Empty
	  if ((0, _element.isEmpty)(next)) {
	    return [];
	  }

	  return [];
	}

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createPath = exports.groupByKey = exports.isSameThunk = exports.isNative = exports.isEmpty = exports.isText = exports.isThunk = undefined;
	exports.create = create;
	exports.createTextElement = createTextElement;
	exports.createEmptyElement = createEmptyElement;
	exports.createThunkElement = createThunkElement;

	var _isUndefined = __webpack_require__(178);

	var _isUndefined2 = _interopRequireDefault(_isUndefined);

	var _reduceArray = __webpack_require__(179);

	var _reduceArray2 = _interopRequireDefault(_reduceArray);

	var _isString = __webpack_require__(180);

	var _isString2 = _interopRequireDefault(_isString);

	var _isNumber = __webpack_require__(181);

	var _isNumber2 = _interopRequireDefault(_isNumber);

	var _isNull = __webpack_require__(182);

	var _isNull2 = _interopRequireDefault(_isNull);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
	  children = (0, _reduceArray2.default)(reduceChildren, [], children || []);

	  var key = (0, _isString2.default)(attributes.key) || (0, _isNumber2.default)(attributes.key) ? attributes.key : null;

	  delete attributes.key;

	  if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
	    return createThunkElement(type.render, key, attributes, children, type);
	  }

	  if (typeof type === 'function') {
	    return createThunkElement(type, key, attributes, children, type);
	  }

	  return {
	    type: 'native',
	    tagName: type,
	    attributes: attributes,
	    children: children,
	    key: key
	  };
	}

	/**
	 * Cleans up the array of child elements.
	 * - Flattens nested arrays
	 * - Converts raw strings and numbers into vnodes
	 * - Filters out undefined elements
	 */

	function reduceChildren(children, vnode) {
	  if ((0, _isString2.default)(vnode) || (0, _isNumber2.default)(vnode)) {
	    children.push(createTextElement(vnode));
	  } else if ((0, _isNull2.default)(vnode)) {
	    children.push(createEmptyElement());
	  } else if (Array.isArray(vnode)) {
	    children = [].concat(_toConsumableArray(children), _toConsumableArray(vnode.reduce(reduceChildren, [])));
	  } else if ((0, _isUndefined2.default)(vnode)) {
	    throw new Error('vnode can\'t be undefined. Did you mean to use null?');
	  } else {
	    children.push(vnode);
	  }
	  return children;
	}

	/**
	 * Text nodes are stored as objects to keep things simple
	 */

	function createTextElement(text) {
	  return {
	    type: 'text',
	    nodeValue: text
	  };
	}

	/**
	 * Text nodes are stored as objects to keep things simple
	 */

	function createEmptyElement() {
	  return {
	    type: 'empty'
	  };
	}

	/**
	 * Lazily-rendered virtual nodes
	 */

	function createThunkElement(fn, key, props, children, options) {
	  return {
	    type: 'thunk',
	    fn: fn,
	    children: children,
	    props: props,
	    options: options,
	    key: key
	  };
	}

	/**
	 * Functional type checking
	 */

	var isThunk = exports.isThunk = function isThunk(node) {
	  return node.type === 'thunk';
	};

	var isText = exports.isText = function isText(node) {
	  return node.type === 'text';
	};

	var isEmpty = exports.isEmpty = function isEmpty(node) {
	  return node.type === 'empty';
	};

	var isNative = exports.isNative = function isNative(node) {
	  return node.type === 'native';
	};

	var isSameThunk = exports.isSameThunk = function isSameThunk(left, right) {
	  return isThunk(left) && isThunk(right) && left.fn === right.fn;
	};

	/**
	 * Group an array of virtual elements by their key, using index as a fallback.
	 */

	var groupByKey = exports.groupByKey = function groupByKey(children) {
	  var iterator = function iterator(acc, child, i) {
	    if (!(0, _isUndefined2.default)(child) && child !== false) {
	      var key = (0, _isNull2.default)(child) ? i : child.key || i;
	      acc.push({
	        key: String(key),
	        item: child,
	        index: i
	      });
	    }
	    return acc;
	  };

	  return (0, _reduceArray2.default)(iterator, [], children);
	};

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
/* 178 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose isUndefined
	 */

	module.exports = isUndefined['default'] = isUndefined;

	/**
	 * Check if undefined.
	 * @param  {Mixed}  value
	 * @return {Boolean}
	 */

	function isUndefined(value) {
	  return typeof value === 'undefined';
	}

/***/ },
/* 179 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Modules
	 */

	/**
	 * Expose reduceArray
	 */

	module.exports = reduceArray['default'] = reduceArray;

	/**
	 * reduceArray
	 */

	function reduceArray(cb, init, arr) {
	  var len = arr.length;
	  var acc = init;
	  if (!arr.length) return init;

	  for (var i = 0; i < len; i++) {
	    acc = cb(acc, arr[i], i, arr);
	  }

	  return acc;
	}

/***/ },
/* 180 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose isString
	 */

	module.exports = isString['default'] = isString;

	/**
	 * Check if string
	 * @param  {Mixed}  value
	 * @return {Boolean}
	 */
	function isString(value) {
	  return typeof value === 'string';
	}

/***/ },
/* 181 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Modules
	 */

	/**
	 * Expose isNumber
	 */

	module.exports = isNumber['default'] = isNumber;

	/**
	 * isNumber
	 */

	function isNumber(value) {
	  return typeof value === 'number';
	}

/***/ },
/* 182 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose isNull
	 */

	module.exports = isNull['default'] = isNull;

	/**
	 * isNull
	 */

	function isNull(val) {
	  return val === null;
	}

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.REMOVE = exports.MOVE = exports.UPDATE = exports.CREATE = undefined;

	var _bitVector = __webpack_require__(184);

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
/* 184 */
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
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var curryN = __webpack_require__(186);

	function isString(s) {
	  return typeof s === 'string';
	}
	function isNumber(n) {
	  return typeof n === 'number';
	}
	function isObject(value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return !!value && (type == 'object' || type == 'function');
	}
	function isFunction(f) {
	  return typeof f === 'function';
	}
	var isArray = Array.isArray || function (a) {
	  return 'length' in a;
	};

	var mapConstrToFn = curryN(2, function (group, constr) {
	  return constr === String ? isString : constr === Number ? isNumber : constr === Object ? isObject : constr === Array ? isArray : constr === Function ? isFunction : constr === undefined ? group : constr;
	});

	function Constructor(group, name, validators) {
	  validators = validators.map(mapConstrToFn(group));
	  var constructor = curryN(validators.length, function () {
	    var val = [],
	        v,
	        validator;
	    for (var i = 0; i < arguments.length; ++i) {
	      v = arguments[i];
	      validator = validators[i];
	      if (typeof validator === 'function' && validator(v) || v !== undefined && v !== null && v.of === validator) {
	        val[i] = arguments[i];
	      } else {
	        throw new TypeError('wrong value ' + v + ' passed to location ' + i + ' in ' + name);
	      }
	    }
	    val.of = group;
	    val.name = name;
	    return val;
	  });
	  return constructor;
	}

	function rawCase(type, cases, action, arg) {
	  if (type !== action.of) throw new TypeError('wrong type passed to case');
	  var name = action.name in cases ? action.name : '_' in cases ? '_' : undefined;
	  if (name === undefined) {
	    throw new Error('unhandled value passed to case');
	  } else {
	    return cases[name].apply(undefined, arg !== undefined ? action.concat([arg]) : action);
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

	module.exports = Type;

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _curry2 = __webpack_require__(187);
	var _curryN = __webpack_require__(189);
	var arity = __webpack_require__(190);

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
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _curry1 = __webpack_require__(188);

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
	      return _curry1(function (b) {
	        return fn(a, b);
	      });
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true) {
	      return f2;
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
	      return _curry1(function (a) {
	        return fn(a, b);
	      });
	    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
	      return _curry1(function (b) {
	        return fn(a, b);
	      });
	    } else {
	      return fn(a, b);
	    }
	  };
	};

/***/ },
/* 188 */
/***/ function(module, exports) {

	'use strict';

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
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arity = __webpack_require__(190);

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
	  return function () {
	    var combined = [];
	    var argsIdx = 0;
	    var left = length;
	    var combinedIdx = 0;
	    while (combinedIdx < received.length || argsIdx < arguments.length) {
	      var result;
	      if (combinedIdx < received.length && (received[combinedIdx] == null || received[combinedIdx]['@@functional/placeholder'] !== true || argsIdx >= arguments.length)) {
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
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _curry2 = __webpack_require__(187);

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
	module.exports = _curry2(function (n, fn) {
	  // jshint unused:vars
	  switch (n) {
	    case 0:
	      return function () {
	        return fn.apply(this, arguments);
	      };
	    case 1:
	      return function (a0) {
	        return fn.apply(this, arguments);
	      };
	    case 2:
	      return function (a0, a1) {
	        return fn.apply(this, arguments);
	      };
	    case 3:
	      return function (a0, a1, a2) {
	        return fn.apply(this, arguments);
	      };
	    case 4:
	      return function (a0, a1, a2, a3) {
	        return fn.apply(this, arguments);
	      };
	    case 5:
	      return function (a0, a1, a2, a3, a4) {
	        return fn.apply(this, arguments);
	      };
	    case 6:
	      return function (a0, a1, a2, a3, a4, a5) {
	        return fn.apply(this, arguments);
	      };
	    case 7:
	      return function (a0, a1, a2, a3, a4, a5, a6) {
	        return fn.apply(this, arguments);
	      };
	    case 8:
	      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
	        return fn.apply(this, arguments);
	      };
	    case 9:
	      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
	        return fn.apply(this, arguments);
	      };
	    case 10:
	      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
	        return fn.apply(this, arguments);
	      };
	    default:
	      throw new Error('First argument to arity must be a non-negative integer no greater than ten');
	  }
	});

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.render = undefined;

	var _renderString = __webpack_require__(192);

	var render = _renderString.renderString;

	exports.render = render;

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.renderString = renderString;

	var _isValidAttr = __webpack_require__(193);

	var _isValidAttr2 = _interopRequireDefault(_isValidAttr);

	var _isNull = __webpack_require__(182);

	var _isNull2 = _interopRequireDefault(_isNull);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    if ((0, _isValidAttr2.default)(value)) str += ' ' + name + '="' + attributes[name] + '"';
	  }
	  return str;
	}

	/**
	 * Render a virtual element to a string. You can pass in an option state context
	 * object that will be given to all components.
	 */

	function renderString(vnode, context) {
	  var path = arguments.length <= 2 || arguments[2] === undefined ? '0' : arguments[2];

	  switch (vnode.type) {
	    case 'text':
	      return renderTextNode(vnode);
	    case 'empty':
	      return renderEmptyNode();
	    case 'thunk':
	      return renderThunk(vnode, path, context);
	    case 'native':
	      return renderHTML(vnode, path, context);
	  }
	}

	function renderTextNode(vnode) {
	  return vnode.nodeValue;
	}

	function renderEmptyNode() {
	  return '<noscript></noscript>';
	}

	function renderThunk(vnode, path, context) {
	  var props = vnode.props;
	  var children = vnode.children;

	  var output = vnode.fn({ children: children, props: props, path: path, context: context });
	  return renderString(output, context, path);
	}

	function renderHTML(vnode, path, context) {
	  var attributes = vnode.attributes;
	  var tagName = vnode.tagName;
	  var children = vnode.children;

	  var innerHTML = attributes.innerHTML;
	  var str = '<' + tagName + attributesToString(attributes) + '>';

	  if (innerHTML) {
	    str += innerHTML;
	  } else {
	    str += children.map(function (child, i) {
	      return renderString(child, context, path + '.' + ((0, _isNull2.default)(child.key) ? i : child.key));
	    }).join('');
	  }

	  str += '</' + tagName + '>';
	  return str;
	}

/***/ },
/* 193 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Expose isValidAttr
	 */

	module.exports = isValidAttr;

	/**
	 * isValidAttr
	 */

	function isValidAttr(val) {
	  switch (typeof val === 'undefined' ? 'undefined' : _typeof(val)) {
	    case 'string':
	    case 'number':
	      return true;
	    case 'boolean':
	      return val;
	    default:
	      return false;
	  }
	}

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updateElement = exports.createElement = undefined;

	var _create = __webpack_require__(195);

	var _update = __webpack_require__(207);

	exports.createElement = _create.createElement;
	exports.updateElement = _update.updateElement;

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createElement = createElement;

	var _createElement = __webpack_require__(196);

	var _createElement2 = _interopRequireDefault(_createElement);

	var _element = __webpack_require__(177);

	var _setAttribute = __webpack_require__(197);

	var _isUndefined = __webpack_require__(178);

	var _isUndefined2 = _interopRequireDefault(_isUndefined);

	var _isString = __webpack_require__(180);

	var _isString2 = _interopRequireDefault(_isString);

	var _isNumber = __webpack_require__(181);

	var _isNumber2 = _interopRequireDefault(_isNumber);

	var _isNull = __webpack_require__(182);

	var _isNull2 = _interopRequireDefault(_isNull);

	var _create = __webpack_require__(206);

	var create = _interopRequireWildcard(_create);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var cache = {};
	function createElement(vnode, path, dispatch, context) {

	  switch (vnode.type) {
	    case 'text':
	      return create.createElement(vnode, path, dispatch, context);
	    case 'empty':
	      return create.createElement(vnode, path, dispatch, context);
	    case 'thunk':
	      return createThunk(vnode, path, dispatch, context);
	    case 'native':
	      return createHTMLElement(vnode, path, dispatch, context);
	  }
	}

	function getCachedElement(type) {
	  var cached = cache[type];
	  if ((0, _isUndefined2.default)(cached)) {
	    cached = cache[type] = (0, _createElement2.default)(type);
	  }
	  return cached.cloneNode(false);
	}

	function createThunk(vnode, path, dispatch, context) {
	  if (vnode.type == "thunk") {
	    if (vnode.options.rootNode) {
	      return vnode.options.rootNode;
	    }
	  }

	  if (vnode.options.componentWillMount) {
	    vnode.options.componentWillMount();
	  }

	  var props = vnode.props;
	  var children = vnode.children;
	  var onCreate = vnode.options.onCreate;

	  var model = {
	    children: children,
	    props: props,
	    path: path,
	    dispatch: dispatch,
	    context: context
	  };
	  var output = vnode.fn(model);
	  var childPath = (0, _element.createPath)(path, output.key || '0');
	  var DOMElement = createElement(output, childPath, dispatch, context);
	  var id = vnode.attributes.id || vnode.attributes.key;
	  if (id) {
	    (0, _setAttribute.setAttribute)(DOMElement, "id", id);
	  }
	  if (onCreate) dispatch(onCreate(model));

	  //++
	  if (output.type == "thunk") {
	    throw new Error("组件的跟元素必须是DOM元素");
	  }
	  //保留输出，setState，进行对比
	  vnode.options.vnode = vnode.options.rootVnode = output;
	  vnode.options.node = vnode.options.nativeNode = vnode.options.rootNode = DOMElement;
	  vnode.options.output = output;
	  vnode.nativeNode = DOMElement;
	  DOMElement.vnode = vnode.options;
	  DOMElement.vnodeInstance = vnode;

	  vnode.state.vnode = output;

	  return DOMElement;
	}

	function createHTMLElement(vnode, path, dispatch, context) {
	  var tagName = vnode.tagName;
	  var attributes = vnode.attributes;
	  var children = vnode.children;

	  var DOMElement = getCachedElement(tagName);

	  for (var name in attributes) {
	    (0, _setAttribute.setAttribute)(DOMElement, name, attributes[name]);
	  }

	  children.forEach(function (node, index) {
	    if ((0, _isNull2.default)(node) || (0, _isUndefined2.default)(node)) return;
	    var childPath = (0, _element.createPath)(path, node.key || index);
	    var child = createElement(node, childPath, dispatch, context);
	    DOMElement.appendChild(child);
	  });

	  DOMElement.vnode = vnode;

	  return DOMElement;
	}

/***/ },
/* 196 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (type) {
	  return document.createElement(type);
	};

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeAttribute = removeAttribute;
	exports.setAttribute = setAttribute;

	var _setAttribute = __webpack_require__(198);

	var _setAttribute2 = _interopRequireDefault(_setAttribute);

	var _isValidAttr = __webpack_require__(193);

	var _isValidAttr2 = _interopRequireDefault(_isValidAttr);

	var _isFunction = __webpack_require__(201);

	var _isFunction2 = _interopRequireDefault(_isFunction);

	var _indexOf = __webpack_require__(202);

	var _indexOf2 = _interopRequireDefault(_indexOf);

	var _setify = __webpack_require__(203);

	var _setify2 = _interopRequireDefault(_setify);

	var _events = __webpack_require__(205);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function removeAttribute(DOMElement, name, previousValue) {
	  var eventType = _events2.default[name];
	  if (eventType && (0, _isFunction2.default)(previousValue)) {
	    DOMElement.removeEventListener(eventType, previousValue);
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
	    case 'value':
	      DOMElement[name] = '';
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
	    if ((0, _isFunction2.default)(previousValue)) {
	      DOMElement.removeEventListener(eventType, previousValue);
	    }
	    DOMElement.addEventListener(eventType, value);
	    return;
	  }
	  if (!(0, _isValidAttr2.default)(value)) {
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
	      (0, _setAttribute2.default)(DOMElement, name, value);
	      break;
	  }
	}

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Modules
	 */

	var svgAttributeNamespace = __webpack_require__(199);

	/**
	 * Expose setAttribute
	 */

	module.exports = setAttribute['default'] = setAttribute;

	/**
	 * setAttribute
	 */

	function setAttribute(node, name, value) {
	  var ns = svgAttributeNamespace(name);
	  return ns ? node.setAttributeNS(ns, name, value) : node.setAttribute(name, value);
	}

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Modules
	 */

	var namespaces = __webpack_require__(200);

	/**
	 * Exports
	 */

	module.exports = svgAttributeNamespace['default'] = svgAttributeNamespace;

	/**
	 * Get namespace of svg attribute
	 *
	 * @param {String} attributeName
	 * @return {String} namespace
	 */

	function svgAttributeNamespace(attributeName) {
	  // if no prefix separator in attributeName, then no namespace
	  if (attributeName.indexOf(':') === -1) return null;

	  // get prefix from attributeName
	  var prefix = attributeName.split(':', 1)[0];

	  // if prefix in supported prefixes
	  if (namespaces.hasOwnProperty(prefix)) {
	    // then namespace of prefix
	    return namespaces[prefix];
	  } else {
	    // else unsupported prefix
	    throw new Error('svg-attribute-namespace: prefix "' + prefix + '" is not supported by SVG.');
	  }
	}

/***/ },
/* 200 */
/***/ function(module, exports) {

	'use strict';

	/*
	 * Supported SVG attribute namespaces by prefix.
	 *
	 * References:
	 * - http://www.w3.org/TR/SVGTiny12/attributeTable.html
	 * - http://www.w3.org/TR/SVG/attindex.html
	 * - http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-ElSetAttrNS
	 */

	var svgAttributeNamespaces = {
	  ev: 'http://www.w3.org/2001/xml-events',
	  xlink: 'http://www.w3.org/1999/xlink',
	  xml: 'http://www.w3.org/XML/1998/namespace',
	  xmlns: 'http://www.w3.org/2000/xmlns/'
	};

	/**
	 * Expose svgAttributeNamespaces
	 */

	module.exports = svgAttributeNamespaces;

/***/ },
/* 201 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Modules
	 */

	/**
	 * Expose isFunction
	 */

	module.exports = isFunction['default'] = isFunction;

	/**
	 * isFunction
	 */

	function isFunction(value) {
	  return typeof value === 'function';
	}

/***/ },
/* 202 */
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
	  var i = start < 0 ? len + start : start;

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
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var naturalSelection = __webpack_require__(204);

	module.exports = function (element, value) {
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
/* 204 */
/***/ function(module, exports) {

	'use strict';

	var supportedTypes = ['text', 'search', 'tel', 'url', 'password'];

	module.exports = function (element) {
	    return !!(element.setSelectionRange && ~supportedTypes.indexOf(element.type));
	};

/***/ },
/* 205 */
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
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createElement = createElement;

	var _createElement = __webpack_require__(196);

	var _createElement2 = _interopRequireDefault(_createElement);

	var _element = __webpack_require__(177);

	var _setAttribute = __webpack_require__(197);

	var _isUndefined = __webpack_require__(178);

	var _isUndefined2 = _interopRequireDefault(_isUndefined);

	var _isString = __webpack_require__(180);

	var _isString2 = _interopRequireDefault(_isString);

	var _isNumber = __webpack_require__(181);

	var _isNumber2 = _interopRequireDefault(_isNumber);

	var _isNull = __webpack_require__(182);

	var _isNull2 = _interopRequireDefault(_isNull);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var cache = {};

	/**
	 * Create a real DOM element from a virtual element, recursively looping down.
	 * When it finds custom elements it will render them, cache them, and keep going,
	 * so they are treated like any other native element.
	 */

	function createElement(vnode, path, dispatch, context) {
	  switch (vnode.type) {
	    case 'text':
	      return createTextNode(vnode.nodeValue);
	    case 'empty':
	      return getCachedElement('noscript');
	    case 'thunk':
	      return createThunk(vnode, path, dispatch, context);
	    case 'native':
	      return createHTMLElement(vnode, path, dispatch, context);
	  }
	}

	function getCachedElement(type) {
	  var cached = cache[type];
	  if ((0, _isUndefined2.default)(cached)) {
	    cached = cache[type] = (0, _createElement2.default)(type);
	  }
	  return cached.cloneNode(false);
	}

	function createTextNode(text) {
	  var value = (0, _isString2.default)(text) || (0, _isNumber2.default)(text) ? text : '';
	  return document.createTextNode(value);
	}

	function createThunk(vnode, path, dispatch, context) {
	  var props = vnode.props;
	  var children = vnode.children;
	  var onCreate = vnode.options.onCreate;

	  var model = {
	    children: children,
	    props: props,
	    path: path,
	    dispatch: dispatch,
	    context: context
	  };
	  var output = vnode.fn(model);
	  var childPath = (0, _element.createPath)(path, output.key || '0');
	  var DOMElement = createElement(output, childPath, dispatch, context);
	  if (onCreate) dispatch(onCreate(model));
	  vnode.state = {
	    vnode: output,
	    model: model
	  };
	  return DOMElement;
	}

	function createHTMLElement(vnode, path, dispatch, context) {
	  var tagName = vnode.tagName;
	  var attributes = vnode.attributes;
	  var children = vnode.children;

	  var DOMElement = getCachedElement(tagName);

	  for (var name in attributes) {
	    (0, _setAttribute.setAttribute)(DOMElement, name, attributes[name]);
	  }

	  children.forEach(function (node, index) {
	    if ((0, _isNull2.default)(node) || (0, _isUndefined2.default)(node)) return;
	    var childPath = (0, _element.createPath)(path, node.key || index);
	    var child = createElement(node, childPath, dispatch, context);
	    DOMElement.appendChild(child);
	  });

	  return DOMElement;
	}

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.insertAtIndex = undefined;
	exports.updateElement = updateElement;

	var _setAttribute2 = __webpack_require__(197);

	var _element = __webpack_require__(177);

	var _diff = __webpack_require__(176);

	var _reduceArray = __webpack_require__(179);

	var _reduceArray2 = _interopRequireDefault(_reduceArray);

	var _create = __webpack_require__(195);

	var _toArray = __webpack_require__(208);

	var _toArray2 = _interopRequireDefault(_toArray);

	var _foreach = __webpack_require__(209);

	var _foreach2 = _interopRequireDefault(_foreach);

	var _noop = __webpack_require__(214);

	var _noop2 = _interopRequireDefault(_noop);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Modify a DOM element given an array of actions.
	 */

	function updateElement(dispatch, context) {
	  return function (DOMElement, action) {
	    _diff.Actions.case({
	      sameNode: _noop2.default,
	      setAttribute: function setAttribute(name, value, previousValue) {
	        (0, _setAttribute2.setAttribute)(DOMElement, name, value, previousValue);
	      },
	      removeAttribute: function removeAttribute(name, previousValue) {
	        (0, _setAttribute2.removeAttribute)(DOMElement, name, previousValue);
	      },
	      insertBefore: function insertBefore(index) {
	        insertAtIndex(DOMElement.parentNode, index, DOMElement);
	      },
	      updateChildren: function updateChildren(changes) {
	        _updateChildren(DOMElement, changes, dispatch, context);
	      },
	      updateThunk: function updateThunk(prev, next, path) {
	        DOMElement = _updateThunk(DOMElement, prev, next, path, dispatch, context);
	      },
	      replaceNode: function replaceNode(prev, next, path) {
	        var newEl = (0, _create.createElement)(next, path, dispatch, context);
	        var parentEl = DOMElement.parentNode;
	        if (parentEl) parentEl.replaceChild(newEl, DOMElement);
	        DOMElement = newEl;
	        removeThunks(prev, dispatch);
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
	 * Update all the children of a DOMElement using an array of actions
	 */

	function _updateChildren(DOMElement, changes, dispatch, context) {
	  // Create a clone of the children so we can reference them later
	  // using their original position even if they move around
	  var childNodes = (0, _toArray2.default)(DOMElement.childNodes);
	  changes.forEach(function (change) {
	    _diff.Actions.case({
	      insertChild: function insertChild(vnode, index, path) {
	        insertAtIndex(DOMElement, index, (0, _create.createElement)(vnode, path, dispatch, context));
	      },
	      removeChild: function removeChild(index) {
	        DOMElement.removeChild(childNodes[index]);
	      },
	      updateChild: function updateChild(index, actions) {
	        var _update = updateElement(dispatch, context);
	        actions.forEach(function (action) {
	          return _update(childNodes[index], action);
	        });
	      }
	    }, change);
	  });
	}

	/**
	 * Update a thunk and only re-render the subtree if needed.
	 */

	function _updateThunk(DOMElement, prev, next, path, dispatch, context) {
	  var props = next.props;
	  var children = next.children;
	  var onUpdate = next.options.onUpdate;

	  var prevNode = prev.state.vnode;
	  var model = {
	    children: children,
	    props: props,
	    path: path,
	    dispatch: dispatch,
	    context: context
	  };
	  var nextNode = next.fn(model);
	  var changes = (0, _diff.diffNode)(prevNode, nextNode, (0, _element.createPath)(path, '0'));
	  DOMElement = (0, _reduceArray2.default)(updateElement(dispatch, context), DOMElement, changes);
	  if (onUpdate) dispatch(onUpdate(model));
	  next.state = {
	    vnode: nextNode,
	    model: model
	  };
	  return DOMElement;
	}

	/**
	 * Recursively remove all thunks
	 */

	function removeThunks(vnode, dispatch) {
	  while ((0, _element.isThunk)(vnode)) {
	    var onRemove = vnode.options.onRemove;
	    var model = vnode.state.model;

	    if (onRemove) dispatch(onRemove(model));
	    vnode = vnode.state.vnode;
	  }
	  if (vnode.children) {
	    (0, _foreach2.default)(vnode.children, function (child) {
	      return removeThunks(child, dispatch);
	    });
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
/* 208 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose toArray
	 */

	module.exports = toArray['default'] = toArray;

	/**
	 * Convert to an array from array like
	 * @param  {ArrayLike} arr
	 * @return {Array}
	 */

	function toArray(arr) {
	  var len = arr.length;
	  var idx = -1;

	  var array = new Array(len);
	  while (++idx < len) {
	    array[idx] = arr[idx];
	  }
	  return array;
	}

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Modules
	 */

	var isObject = __webpack_require__(210);
	var isArray = __webpack_require__(211);
	var forEachObj = __webpack_require__(212);
	var forEachArr = __webpack_require__(213);

	/**
	 * Expose foreach
	 */

	module.exports = forEach['default'] = forEach;

	/**
	 * For each
	 * @param  {Function} fn  iterator
	 * @param  {Object}   obj object to iterate over
	 */

	function forEach(fn, a) {
	  if (isArray(a)) return forEachArr.call(this, fn, a);
	  if (isObject(a)) return forEachObj.call(this, fn, a);
	}

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Modules
	 */

	var isFunction = __webpack_require__(201);

	/**
	 * Expose isObject
	 */

	module.exports = isObject;

	/**
	 * Constants
	 */

	var objString = toString(Object);

	/**
	 * Check for plain object.
	 *
	 * @param {Mixed} val
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(val) {
	  return !!val && (val.constructor === Object || isObjectString(val.constructor));
	}

	function isObjectString(val) {
	  return !!val && isFunction(val) && toString(val) === objString;
	}

	function toString(val) {
	  return Function.prototype.toString.call(val);
	}

/***/ },
/* 211 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose isArray
	 */

	module.exports = isArray['default'] = isArray;

	/**
	 * isArray
	 */

	function isArray(val) {
	  return Array.isArray(val);
	}

/***/ },
/* 212 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Expose forEach
	 */

	module.exports = forEach;

	/**
	 * forEach
	 */

	function forEach(fn, obj) {
	  if (!obj) return;

	  var keys = Object.keys(obj);

	  for (var i = 0, len = keys.length; i < len; ++i) {
	    var key = keys[i];
	    fn.call(this, obj[key], key, i);
	  }
	}

/***/ },
/* 213 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose forEach
	 */

	module.exports = forEach['default'] = forEach;

	/**
	 * forEach
	 */

	function forEach(fn, arr) {
	  if (!arr) return;

	  for (var i = 0, len = arr.length; i < len; ++i) {
	    fn.call(this, arr[i], i);
	  }
	}

/***/ },
/* 214 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Exports
	 */

	module.exports = noop['default'] = noop;

	/**
	 * Noop
	 */

	function noop() {}

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createApp = createApp;

	var _dom = __webpack_require__(194);

	var dom = _interopRequireWildcard(_dom);

	var _diff = __webpack_require__(176);

	var _emptyElement = __webpack_require__(216);

	var _emptyElement2 = _interopRequireDefault(_emptyElement);

	var _noop = __webpack_require__(214);

	var _noop2 = _interopRequireDefault(_noop);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * Create a DOM renderer using a container element. Everything will be rendered
	 * inside of that container. Returns a function that accepts new state that can
	 * replace what is currently rendered.
	 */

	function createApp(container) {
	  var handler = arguments.length <= 1 || arguments[1] === undefined ? _noop2.default : arguments[1];
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var oldVnode = null;
	  var node = null;
	  var rootId = options.id || '0';
	  var dispatch = function dispatch(effect) {
	    return effect && handler(effect);
	  };

	  if (container) {
	    (0, _emptyElement2.default)(container);
	  }

	  var update = function update(newVnode, context) {
	    var changes = (0, _diff.diffNode)(oldVnode, newVnode, rootId);
	    node = changes.reduce(dom.updateElement(dispatch, context), node);
	    oldVnode = newVnode;
	    return node;
	  };

	  var create = function create(vnode, context) {
	    node = dom.createElement(vnode, rootId, dispatch, context);
	    if (container) container.appendChild(node);
	    oldVnode = vnode;
	    return node;
	  };

	  return function (vnode) {
	    var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    return node !== null ? update(vnode, context) : create(vnode, context);
	  };
	}

/***/ },
/* 216 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Expose emptyElement
	 */

	module.exports = emptyElement;

	/**
	 * emptyElement
	 */

	function emptyElement(el) {
	  var node;

	  while (node = el.firstChild) {
	    el.removeChild(node);
	  }

	  return el;
	}

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _index = __webpack_require__(175);

	var utils = __webpack_require__(218);
	var EE = __webpack_require__(219);
	var element = __webpack_require__(221);

	var StyleSheet = __webpack_require__(225);
	var merge = __webpack_require__(223);
	var currentOwner = __webpack_require__(222);
	var registry = {};

	function register(inName, inOptions) {

	  if (!inOptions) {
	    inOptions = inName;
	    inName = "undefined";
	  }

	  var definition = inOptions || {};
	  definition.name = inName || definition.name;

	  if (!inName) {
	    throw new Error('Name argument must not be empty');
	  }

	  resolveTagName(definition);
	  resolveMixin(definition);

	  var SohpieConstructor = function SohpieConstructor() {
	    this.state = {};
	    this.props = {};
	    this.children = [];
	    this.refs = {};

	    var defaultProps = this.getDefaultProps && this.getDefaultProps();
	    var newProps = merge(defaultProps || {}, this.props);
	    this.props = newProps;
	    this.attributes = newProps;

	    var defaultState = this.getInitialState && this.getInitialState();
	    var newState = merge({}, defaultState || {});
	    this.state = newState;
	  };

	  var oldRender = definition.render;
	  var oldComponentDidMount = definition.componentDidMount;
	  var oldComponentWillMount = definition.componentWillMount;
	  var componentDidInsert = definition.componentDidInsert;
	  var componentDidInsert = definition.componentDidInsert;
	  var getDefaultChildren = definition.getDefaultChildren;

	  SohpieConstructor.prototype = definition;

	  if (getDefaultChildren) {
	    SohpieConstructor.prototype.getDefaultChildren = function () {

	      var result = getDefaultChildren.apply(this, arguments);
	      for(var i = 0;i<result.length;i++){
              result[i].parent = this;
		  }
	      return result;
	    };
	  }

	  SohpieConstructor.prototype.render = function () {
	    currentOwner.target = this;
	    var result = oldRender.apply(this, arguments);
	    currentOwner.target = undefined;
	    return result;
	  };

	  // if(Sophie&&Sophie.renderRootElement){
	  //   SohpieConstructor.prototype.render = function(){
	  //     return this.element(this.name, this.attributes, oldRender.apply(this, arguments))
	  //   }
	  // }

	  SohpieConstructor.prototype.componentDidMount = function () {
	    oldComponentDidMount && oldComponentDidMount.apply(this, arguments);
	    EE.trigger("componentDidMount", [this.node]);
	  };

	  SohpieConstructor.prototype.componentDidInserted = function () {
	    oldComponentDidInserted && oldComponentDidInserted.apply(this, arguments);
	    EE.trigger("componentDidInsert", [this.node]);
	  };

	  SohpieConstructor.prototype.componentWillMount = function () {
	    oldComponentWillMount && oldComponentWillMount.apply(this, arguments);
	    EE.trigger("oldComponentWillMount", [this.node]);
	  };

	  //for decleare
	  // SohpieConstructor.prototype.getDefaultProps = function(){}
	  // SohpieConstructor.prototype.getInitialState = function(){}

	  SohpieConstructor.prototype.setState = function (value) {

	    this.state = merge.recursive(this.state, value);
	    this._update();
	  };

	  // //重置render方法，生成根元素
	  // var oRender = definition.render;
	  // SohpieConstructor.prototype.render = function(){
	  //   return element(this.name,this.props,oRender.apply(this,arguments));
	  // }

	  SohpieConstructor.prototype.forceUpdate = SohpieConstructor.prototype._update = function () {
	    // debugger
	    var oldVnode = this.rootVnode;
	    var newVnode = this.render();

	    var changes = _index.diff.diffNode(oldVnode, newVnode, this.id || '0');
	    var node = changes.reduce(_index.dom.updateElement(function () {}, this), this.nativeNode);

	    this.rootVnode = newVnode;
	    this.nativeNode = node;
	    return node;
	  };

	  SohpieConstructor.prototype.element = function () {
	    var vnode = element.apply(null, arguments);

	    return vnode;
	  }, SohpieConstructor.prototype.append = function (child) {
	    var children = this.children;
	    child.parent = this;
	    children.push(child);
	    this._update();
	    if (child.componentDidInsert) {
	      child.componentDidInsert();
	    }
	  };

	  SohpieConstructor.prototype.remove = function (child) {
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
	    if (child.componentDidRemove) {
	      child.componentDidRemove();
	    }
	  };

	  SohpieConstructor.prototype.insertBefore = function (target, before) {
	    var parent = this;
	    var children = parent.children;
	    for (var i = 0; i < children.length; i++) {
	      if (children[i] == before) {
	        children.splice(i, 0, target);

	        target.parent = parent;
	        break;
	      }
	    }
	    this._update();
	    if (target.componentDidInsert) {
	      target.componentDidInsert();
	    }
	  };

	  SohpieConstructor.prototype.insertAfter = function (target, after) {
	    var parent = this;
	    var children = parent.children;
	    for (var i = 0; i < children.length; i++) {
	      if (children[i] == after) {
	        children.splice(i + 1, 0, target);
	        target.parent = parent;

	        break;
	      }
	    }
	    this._update();
	    if (target.componentDidInserted) {
	      target.componentDidInsert();
	    }
	  };

	  SohpieConstructor.createStyleSheet = function (styles, mediaQuery) {
	    StyleSheet.create(styles, mediaQuery, inName);
	  };

	  if (inName !== "undefined") {
	    registerDefinition(inName, SohpieConstructor);
	    document.createElement(inName);
	  }

	  SohpieConstructor.prototype.constructor = SohpieConstructor;

	  return SohpieConstructor;
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

	function isLeaf(inElement) {
	  if (inElement) {
	    var name = inElement.tagName.toLowerCase();
	    return registry[name];
	  }
	}

	var isReady = false;

	module.exports = {

	  registry: registry,
	  isLeaf: isLeaf,

	  register: register
	};

/***/ },
/* 218 */
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
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EventEmitter = __webpack_require__(220);
	var ee = new EventEmitter();

	module.exports = ee;

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*!
	 * EventEmitter v5.1.0 - git.io/ee
	 * Unlicense - http://unlicense.org/
	 * Oliver Caldwell - http://oli.me.uk/
	 * @preserve
	 */

	;(function (exports) {
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
	        } else {
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

	    function isValidListener(listener) {
	        if (typeof listener === 'function' || listener instanceof RegExp) {
	            return true;
	        } else if (listener && (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object') {
	            return isValidListener(listener.listener);
	        } else {
	            return false;
	        }
	    }

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
	        if (!isValidListener(listener)) {
	            throw new TypeError('listener must be a function');
	        }

	        var listeners = this.getListenersAsObject(evt);
	        var listenerIsWrapped = (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object';
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
	        if ((typeof evt === 'undefined' ? 'undefined' : _typeof(evt)) === 'object' && !(evt instanceof RegExp)) {
	            for (i in evt) {
	                if (evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if (typeof value === 'function') {
	                        single.call(this, i, value);
	                    } else {
	                        // Otherwise pass back to the multiple function
	                        multiple.call(this, i, value);
	                    }
	                }
	            }
	        } else {
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
	        var type = typeof evt === 'undefined' ? 'undefined' : _typeof(evt);
	        var events = this._getEvents();
	        var key;

	        // Remove different things depending on the state of evt
	        if (type === 'string') {
	            // Remove all listeners for the specified event
	            delete events[evt];
	        } else if (evt instanceof RegExp) {
	            // Remove all events matching the regex.
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    delete events[key];
	                }
	            }
	        } else {
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

	                for (i = 0; i < listeners.length; i++) {
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
	        } else {
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
	    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	        module.exports = EventEmitter;
	    } else {
	        exports.EventEmitter = EventEmitter;
	    }
	})(undefined || {});

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _index = __webpack_require__(175);

	var currentOwner = __webpack_require__(222);
	var merge = __webpack_require__(223);

	module.exports = function (type, attributes) {
	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  attributes = attributes || {};
	  var key = typeof attributes.key === 'string' || typeof attributes.key === 'number' ? attributes.key : undefined;
	  //id,自动生成Key
	  if (!key) {
	    key = attributes.key = attributes.id;
	  }

	  //class
	  if (typeof type === 'function') {
	    type = new type();
	    if (type.render) {
	      var oldRender = type.render;
	      type.render = function () {
	        return oldRender.apply(type, []);
	      };
	    }
	  }

	  var args = [type, attributes];
	  if (children && children.length) {
	    var newChildren = [];
	    for (var i = 0; i < children.length; i++) {
	      if (children[i]) {
	        newChildren.push(children[i]);
	      }
	    }
	    args.push(newChildren);
	  }

	  var result = _index.element.apply(null, args);

	  if (result.type == "thunk" && result.options) {

	    // type: 'thunk',
	    // fn,
	    // children,
	    // props,
	    // options,
	    // key
	    var options = result.options;
	    options.type = result.type;
	    options.fn = result.fn;
	    options.key = result.key;
	    options.children = result.children;
	    options.attributes = options.props = merge(options.props, result.props);

	    options.props.children = result.children;

	    if (!options.props.children || options.props.children == 0) {
	      if (options.getDefaultChildren) {
	        options.props.children = options.getDefaultChildren();
	      }
	    }

	    //保持deku的结构
	    options.options = options;
	    result = options;
	  }

	  var children = result.children;
	  for (var i = 0; i < children.length; i++) {
	    if (!children[i]) continue;
	    if (!children[i].parent) {
	      children[i].parent = result;
	    }
	  }

	  result.compontentContext = result._owner = currentOwner.target;

	  if (attributes && attributes["ref"]) {
	    var refValue = attributes["ref"];
	    if (currentOwner.target) currentOwner.target.refs[refValue] = result;
	  }

	  return result;
	};

/***/ },
/* 222 */
/***/ function(module, exports) {

	"use strict";

	var currentOwner = {
	  target: undefined
	};

	module.exports = currentOwner;

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function (isNode) {

		/**
	  * Merge one or more objects 
	  * @param bool? clone
	  * @param mixed,... arguments
	  * @return object
	  */

		var Public = function Public(clone) {

			return merge(clone === true, false, arguments);
		},
		    publicName = 'merge';

		/**
	  * Merge two or more objects recursively 
	  * @param bool? clone
	  * @param mixed,... arguments
	  * @return object
	  */

		Public.recursive = function (clone) {

			return merge(clone === true, true, arguments);
		};

		/**
	  * Clone the input removing any reference
	  * @param mixed input
	  * @return mixed
	  */

		Public.clone = function (input) {

			var output = input,
			    type = typeOf(input),
			    index,
			    size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index = 0; index < size; ++index) {

					output[index] = Public.clone(input[index]);
				}
			} else if (type === 'object') {

				output = {};

				for (index in input) {

					output[index] = Public.clone(input[index]);
				}
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

			if (typeOf(base) !== 'object') return extend;

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

			if (clone || typeOf(result) !== 'object') result = {};

			for (var index = 0; index < size; ++index) {

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

			return {}.toString.call(input).slice(8, -1).toLowerCase();
		}

		if (isNode) {

			module.exports = Public;
		} else {

			window[publicName] = Public;
		}
	})(( false ? 'undefined' : _typeof(module)) === 'object' && module && _typeof(module.exports) === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(224)(module)))

/***/ },
/* 224 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var CSSPropertyOperations = __webpack_require__(226);

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
	  create: function create(styles, mediaQuery, name) {
	    if (!head) {
	      head = document.getElementsByTagName("head")[0];
	    }

	    var style = document.createElement("style");
	    if (name) {
	      style.setAttribute("data-name", name);
	    }
	    var cssText = ObjectToCssText(styles, mediaQuery);
	    style.innerText = cssText;
	    head.appendChild(style);
	  }
	};

	module.exports = StyleSheet;

/***/ },
/* 226 */
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

	var CSSProperty = __webpack_require__(227);

	var camelizeStyleName = __webpack_require__(228);
	var dangerousStyleValue = __webpack_require__(229);
	var hyphenateStyleName = __webpack_require__(231);

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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 227 */
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
/* 228 */
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
/* 229 */
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

	var CSSProperty = __webpack_require__(227);
	var warning = __webpack_require__(230);

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
/* 230 */
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
/* 231 */
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
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _index = __webpack_require__(175);

	function mountAfterElement(mountVnode) {
	  if (_index.vnode.isThunk(mountVnode)) {
	    var component = mountVnode;
	    //保留输出，setState，进行对比
	    var output = component.rootVnode;

	    if (component.componentAfterMount) {
	      component.componentAfterMount();
	    }
	    output.children.forEach(function (node, index) {
	      if (node === null || node === undefined) {
	        return;
	      }
	      var child = mountAfterElement(node);
	    });
	  } else {
	    var children = mountVnode.children;
	    if (children) {
	      children.forEach(function (node, index) {
	        if (node === null || node === undefined) {
	          return;
	        }
	        var child = mountAfterElement(node);
	      });
	    }
	  }
	}
	function mountBeforeElement(mountVnode) {

	  if (_index.vnode.isThunk(mountVnode)) {

	    var component = mountVnode;
	    //保留输出，setState，进行对比
	    var output = component.rootVnode;;
	    output.children.forEach(function (node, index) {
	      if (node === null || node === undefined) {
	        return;
	      }
	      var child = mountBeforeElement(node);
	    });

	    if (component.componentDidMount) {
	      component.componentDidMount();
	    }
	  } else {
	    var children = mountVnode.children;
	    if (children) {
	      children.forEach(function (node, index) {
	        if (node === null || node === undefined) {
	          return;
	        }
	        var child = mountBeforeElement(node);
	      });
	    }
	  }
	}

	function mountElement(mountVnode) {
	  mountBeforeElement(mountVnode);
	  mountAfterElement(mountVnode);
	}

	module.exports = mountElement;

/***/ },
/* 233 */
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
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Register = __webpack_require__(217);

	module.exports = function (tagName, prototype) {
	  return Register.register(tagName, prototype);
	};

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _index = __webpack_require__(175);

	var utils = __webpack_require__(218); //bootstrap

	var Register = __webpack_require__(217);
	var Element = __webpack_require__(221);
	var EE = __webpack_require__(219);
	var StyleSheet = __webpack_require__(225);
	var mount = __webpack_require__(232);

	var currentOwner = __webpack_require__(222);

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
	    var render = (0, _index.createApp)(container);
	    var vnode = Element(compontent, {}, null);
	    Sophie.firstVnode = vnode;
	    render(vnode);
	    mount(vnode);
	    if (!isReady) {
	      isReady = true;
	      if (fire !== false) {
	        EE.trigger("ready", [vnode]);
	        fireReady();
	      }
	    }

	    // })
	  },

	  ready: ready,
	  renderToJSON: function renderToJSON() {
	    // app
	    var outVnode = Sophie.firstVnode.rootVnode;
	    var walk = function walk(vnode) {

	      var currentData = {};
	      var children = vnode.children;

	      if (Sophie.isThunk(vnode)) {
	        var component = vnode;
	        children = vnode.children;

	        currentData.type = "thunk";
	        // currentData.state = component.state
	        var attributes = {};
	        for (var p in component.attributes) {
	          if (p == "children") continue;
	          attributes[p] = component.attributes[p];
	        }
	        currentData.attributes = attributes;
	        currentData.name = component.name;
	      } else if (vnode.type == "text") {
	        currentData.type = vnode.type;
	        currentData.nodeValue = vnode.nodeValue;
	      } else if (vnode.type == "native") {
	        currentData.type = "native";
	        currentData.tagName = vnode.tagName;
	        var attributes = {};
	        for (var p in vnode.attributes) {
	          if (p == "children") continue;
	          attributes[p] = vnode.attributes[p];
	        }
	        currentData.attributes = attributes;
	      }
	      currentData.children = [];
	      if (children && children.length) {
	        for (var i = 0; i < children.length; i++) {
	          if (children[i]) currentData.children.push(walk(children[i]));
	        }
	      }
	      if (!currentData.type) {
	        currentData = undefined;
	      }
	      return currentData;
	    };

	    var data = walk(outVnode);
	    return data;
	  },
	  renderFromJSON: function renderFromJSON(data, container, callback) {
	    var htmlData = data;
	    if (htmlData) {
	      var site = htmlData;
	      var APP = Sophie.createClass("app", {
	        render: function render() {
	          var self = this;
	          var func = function func(children) {
	            var result = [];
	            for (var i = 0; i < children.length; i++) {
	              var c = children[i];
	              if (!c || !c.type) continue;

	              if (c.type == "thunk") {
	                result.push(self.element(Sophie.registry[c.name], c.attributes, func(c.children)));
	              } else if (c.type == "text") {

	                result.push({
	                  type: 'text',
	                  nodeValue: c.nodeValue
	                });
	              } else if (c.type = "native") {
	                result.push(self.element(c.tagName, c.attributes, func(c.children)));
	              }
	            }

	            return result;
	          };
	          return this.element("app", {}, func(site.children));
	        }

	      });

	      Sophie.runApp(APP, container || $("#dotlinkface").get(0), true);
	    }

	    setTimeout(function () {
	      callback && callback();
	    }, 0);
	  },
	  //第个组件生成元素
	  isBaseVnode: function isBaseVnode(vnode) {
	    return vnode._owner && vnode._owner.name == Sophie.firstVnode.name;
	  },

	  getOwner: function getOwner(vnode) {

	    return vnode._owner;
	  },

	  getParent: function getParent(vnode) {
	    return vnode.parent;
	  },
	  closestBaseParent: function closestBaseParent(vnode) {
	    if (this.isBaseVnode(vnode)) {
	      return vnode;
	    } else {
	      var owner = this.getOwner(vnode);
	      return this.closestBaseParent(owner);
	    }
	  },
	  getBaseParent: function getBaseParent(vnode) {
	    var parent = this.getParent(vnode);
	    if (this.isBaseVnode(parent)) {
	      return parent;
	    } else {
	      var owner = this.getOwner(parent);
	      return this.closestBaseParent(owner);
	    }
	  },

	  createVnodeByTagName: function createVnodeByTagName(name) {
	    var compontent = Register.registry[name];
	    if (!compontent) throw new Error("name 没有注册");

	    currentOwner.target = Sophie.firstVnode;

	    var vnode = Element(compontent, {}, null);
	    currentOwner.target = undefined;
	    return vnode;
	  },

	  createElementByVnode: function createElementByVnode(vnode) {

	    return _index.dom.createElement(vnode, 0);
	  },

	  createElementByTagName: function createElementByTagName(name) {

	    var vnode = this.createVnodeByTagName(name);

	    return this.createElementByVnode(vnode);
	  }

	};

/***/ }
/******/ ]);