'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Actions = undefined;
exports.diffAttributes = diffAttributes;
exports.diffChildren = diffChildren;
exports.diffNode = diffNode;

var _element = require('../element');

var _dift = require('dift');

var diffActions = _interopRequireWildcard(_dift);

var _unionType = require('union-type');

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