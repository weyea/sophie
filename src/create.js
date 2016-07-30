var {dom,diff,element,vnode} = require("deku");

var  createElement = function(vnode, path, dispatch, context){

  switch (vnode.type) {
    case 'text':
      return dom.createElement(vnode, path, dispatch, context)
    case 'empty':
      return dom.createElement(vnode, path, dispatch, context)
    case 'thunk':
      return createThunk(vnode, path, dispatch, context)
    case 'native':
      return dom.createElement(vnode, path, dispatch, context)
  }
}

function createThunk (vnode, path, dispatch, context) {
  if(vnode.type =="thunk"){
    if(vnode.options.rootNode){
      return  vnode.options.rootNode
    }
  }

  var DOMElement = dom.createElement(vnode, path, dispatch, context);

  if(vnode.type =="thunk"){
    if(vnode.state.output.type =="thunk"){
      throw new Error("组件的跟元素必须是DOM元素");
    }
    //保留输出，setState，进行对比
    vnode.options.vnode= vnode.options.rootVnode= vnode.state.output;
    component.node = component.nativeNode= component.rootNode =  DOMElement;
    vnode.options.output = vnode.state.output;
    vnode.nativeNode = DOMElement;
    DOMElement.vnode = vnode.options;
  }
}

dom.createElement = createElement;
