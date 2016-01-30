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


  if(vnode.nativeNode){
    return vnode.nativeNode;
  }

  if(vnode.attributes&&vnode.attributes["ref"]&&context.refs){
          context.refs[vnode.attributes["ref"]] = vnode.component || vnode
  }

  if ((0, _element.isText)(vnode)) {
    var value = typeof vnode.nodeValue === 'string' || typeof vnode.nodeValue === 'number' ? vnode.nodeValue : '';
    return document.createTextNode(value);
  }




  if ((0, _element.isThunk)(vnode)) {

    var component = vnode.component;
    var children = component.children;
    var props = component.props;
    var type = component.type||"div";

    //为了元素增加一个包装原始
    var childrenWrap = _element.create("children",{}, children);
    component.children = childrenWrap

    //生成ref引用



    var model = {
      children: children,
      props: props,
      path: path,
      dispatch: dispatch,
      context: context
    };


    var cached = cache[type];

    if (typeof cached === 'undefined') {
      cached = cache[type] =  document.createElement(type);
    }

     if(component.componentWillMount){
       component.componentWillMount();
     }

    var thisDOMElement = cached.cloneNode(false);

    for (var name in component.attributes) {
      (0, _setAttribute.setAttribute)(thisDOMElement, name, component.attributes[name]);
    }



    var output = component.render(model);
    if(output){
      var _DOMElement = createElement(output, (0, _element.createPath)(path, output.key || '0'), dispatch, component);

    }



    vnode.state = {
      vnode: output,
      model: model,
      nativeNode :thisDOMElement
    }

    //保留输出，setState，进行对比
    component.vnode= output;

    component.node = _DOMElement
    component.path = path;

    if(output){
        thisDOMElement.appendChild(_DOMElement);
    }

    component.nativeNode = thisDOMElement
    thisDOMElement.__upgraded__ = true;

    if (component.onCreate) component.onCreate(model);
    if(component.componentDidMount){
      component.componentDidMount();
    }

    return thisDOMElement;
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

  return DOMElement;
}
