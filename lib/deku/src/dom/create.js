import createNativeElement from './_create-element'
import {createPath} from '../element'
import {setAttribute} from './setAttribute'
import isUndefined from '@f/is-undefined'
import isString from '@f/is-string'
import isNumber from '@f/is-number'
import isNull from '@f/is-null'
const cache = {}
import * as create from './_create'


export function createElement (vnode, path, dispatch, context){

  switch (vnode.type) {
    case 'text':
      return create.createElement(vnode, path, dispatch, context)
    case 'html':
      return createFragment(vnode.nodeValue);
    case 'empty':
      return create.createElement(vnode, path, dispatch, context)
    case 'thunk':
      return createThunk(vnode, path, dispatch, context)
    case 'native':
      return createHTMLElement(vnode, path, dispatch, context)
  }
}

function createFragment (html) {
  var div = document.createElement("div");
  div.innerHTML = html;
  var fragment = document.createDocumentFragment()
  var children = []
  for(var i =0; i < div.childNodes.length; i++){
    children[i] = div.childNodes[i];
  }

  for(var i =0; i < children.length; i++){
    fragment.appendChild(children[i]);
  }

  return fragment
}


function getCachedElement (type) {
  let cached = cache[type]
  if (isUndefined(cached)) {
    cached = cache[type] = createNativeElement(type)
  }
  return cached.cloneNode(false)
}

function createThunk (vnode, path, dispatch, context) {
  if(vnode.type =="thunk"){
    if(vnode.options.rootNode){
      return  vnode.options.rootNode
    }
  }

  if(vnode.options.componentWillMount){
     vnode.options.componentWillMount();
   }



  let { props, children } = vnode
  let { onCreate } = vnode.options

  let model = {
    children,
    props,
    path,
    dispatch,
    context
  }

  let output = vnode.fn(model);

    var  DOMElement;
  if(output){
      let childPath = createPath(path, output.key || '0');
      DOMElement = createElement(output, childPath, dispatch, context)
      var id = vnode.attributes.id || vnode.attributes.key
      if(id){
          setAttribute(DOMElement, "id", id);
      }
  }

  if (onCreate) dispatch(onCreate(model))


  //++
  if(output.type =="thunk"){
    throw new Error("组件的跟元素必须是DOM元素");
  }
  //保留输出，setState，进行对比
  vnode.options.vnode= vnode.options.rootVnode= output;
  vnode.options.node = vnode.options.nativeNode= vnode.options.rootNode =  DOMElement;
  vnode.options.output = output;
  vnode.nativeNode = DOMElement;
  DOMElement.vnode = vnode.options;
  DOMElement.rootVnode = vnode.options;
  DOMElement.vnodeInstance = vnode;

  

  return DOMElement;
}


function createHTMLElement (vnode, path, dispatch, context) {
  let { tagName, attributes, children } = vnode
  let DOMElement = getCachedElement(tagName)

  for (let name in attributes) {
    setAttribute(DOMElement, name, attributes[name])
  }

  children.forEach((node, index) => {
    if (isNull(node) || isUndefined(node)) return
    let childPath = createPath(path, node.key || index)
    let child = createElement(node, childPath, dispatch, context)
    DOMElement.appendChild(child)
  })

  DOMElement.vnode = vnode

  vnode.node = vnode.nativeNode= vnode.rootNode =  DOMElement;


  return DOMElement
}
