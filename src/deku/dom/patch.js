'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertAtIndex = undefined;
exports.default = patch;

var _setAttribute2 = require('./setAttribute');

var _element = require('../element');

var _createElement = require('./createElement');

var _createElement2 = _interopRequireDefault(_createElement);

var _diff = require('../diff');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        var component = next;
        var props = component.props;
        var children = component.children;


        var prevNode = prev.vnode;

        if(component.componentWillUpdate){
            component.componentWillUpdate()
        }
        var nextNode = component.render();
        var changes = (0, _diff.diffNode)(prevNode, nextNode, (0, _element.createPath)(path, '0'));
        DOMElement = changes.reduce(patch(dispatch, context), DOMElement);
        if (component.onUpdate) component.onUpdate();

        if(component.componentDidUpdate){
            component.componentDidUpdate()
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
  
    var component = vnode;

    if(component.componentWillUnmount){
        component.componentWillUnmount()
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
