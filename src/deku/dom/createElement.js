'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createElement;

var _element = require('../element');
var _setAttribute = require('./setAttribute');



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

/**
 * Create a real DOM element from a virtual element, recursively looping down.
 * When it finds custom elements it will render them, cache them, and keep going,
 * so they are treated like any other native element.
 */

function createElement(vnode, path, dispatch, context) {



  vnode.context = context

  if ((0, _element.isText)(vnode)) {
    var value = typeof vnode.nodeValue === 'string' || typeof vnode.nodeValue === 'number' ? vnode.nodeValue : '';
    return vnode.nativeNode||document.createTextNode(value);
  }


  if ((0, _element.isThunk)(vnode)) {

    var component = vnode;
    var children = component.children;
    var props = component.props;
    var type = component.type || "div";


  //  为了元素增加一个包装原始

    var childrenWrap = _element.create("children",{}, children);
    component.children = children
    component.content = childrenWrap



    if(component.componentWillMount){
      component.componentWillMount();
    }

    var oldNativeNode;
    if(vnode.nativeNode){
      oldNativeNode = vnode.nativeNode;
    }

    if(oldNativeNode){
      return  oldNativeNode;
    }

    var output = component.render();
    var _DOMElement ;
    if(output){


      _DOMElement = createElement(output, (0, _element.createPath)(path, output.key || '0'), dispatch, vnode);

      if(vnode.attributes["id"]){
        (0, _setAttribute.setAttribute)(_DOMElement, "id", vnode.attributes["id"]);
      }
      if(vnode.attributes["key"]){
        (0, _setAttribute.setAttribute)(_DOMElement, "key", vnode.attributes["key"]);
      }

    }



    //保留输出，setState，进行对比
    component.vnode= output;

    component.node = _DOMElement
    component.path = path;



    component.nativeNode = _DOMElement
    vnode.nativeNode = _DOMElement
    _DOMElement.__upgraded__ = true;

    // if (component.onCreate) component.onCreate(model);
    // if(component.componentDidMount){
    //   component.componentDidMount();
    // }

    _DOMElement.vnode = component

    return _DOMElement;
  }


  if(vnode.nativeNode){
    return  vnode.nativeNode
   }
  var cached = cache[vnode.type];

  if (typeof cached === 'undefined') {
    cached = cache[vnode.type] =  document.createElement(vnode.type);
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
  vnode.nativeNode = DOMElement
  DOMElement.vnode = vnode


  return DOMElement;
}
