'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDOMRenderer;

var _createElement = require('./createElement');

var _createElement2 = _interopRequireDefault(_createElement);

var _diff = require('../diff');

var _patch = require('./patch');

var _patch2 = _interopRequireDefault(_patch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    oldVnode = vnode;
    return node;
  };

  return function (vnode) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return node !== null ? update(vnode, context) : create(vnode, context);
  };
}
