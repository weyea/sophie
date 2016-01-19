'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = exports.dom = exports.diff = exports.vnode = exports.string = exports.element = undefined;

var _diff = require('./diff');

var diff = _interopRequireWildcard(_diff);

var _element = require('./element');

var vnode = _interopRequireWildcard(_element);

var _string = require('./string');

var string = _interopRequireWildcard(_string);

var _dom = require('./dom');

var dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var element = vnode.create;
var h = vnode.create;

exports.element = element;
exports.string = string;
exports.vnode = vnode;
exports.diff = diff;
exports.dom = dom;
exports.h = h;