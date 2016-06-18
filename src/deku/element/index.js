'use strict';

var merge = require("merge")

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

if (!Array.isArray) {
  Array.isArray = function(arg) {
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

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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

  if(!key){
    key = attributes.key = attributes.id
  }

  if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
    return createThunkElement(type, key, attributes, children);
  }

  if (typeof type === 'function') {
    type = new type();
    return createThunkElement(type, key, attributes, children);
  }

  //创建标签

  var result =  {
    attributes: attributes,
    children: children,
    type: type,
    key: key
  };


  for(var i = 0;i<children.length;i++){
    if(!children[i])continue;

    children[i].parent = result;


  }


  return result
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
  if(!props) props = {};
  // props.children = children;


    component.key = key
    component.type = "#thunk"


    for(var i = 0;i<children.length;i++){
      if(!children[i])continue;
      children[i].parent = component;

    }
    component.children = children

  var defaultProps = component.getDefaultProps&&component.getDefaultProps()
  var newProps = merge.recursive(defaultProps||{}, props)
  component.props = newProps;
  component.attributes = newProps

  var defaultState = component.getInitialState&&component.getInitialState()
  var newState = merge.recursive({},defaultState||{})
    component.state = newState




  return  component
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
  return isThunk(left) && isThunk(right) && left === right;
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
