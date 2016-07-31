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
    case 'empty':
      return create.createElement(vnode, path, dispatch, context)
    case 'thunk':
      return createThunk(vnode, path, dispatch, context)
    case 'native':
      return createHTMLElement(vnode, path, dispatch, context)
  }
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


  let { props, children } = vnode
  let { onCreate } = vnode.options
  let model = {
    children,
    props,
    path,
    dispatch,
    context
  }
  let output = vnode.fn(model)
  let childPath = createPath(path, output.key || '0')
  let DOMElement = createElement(output, childPath, dispatch, context)
  if (onCreate) dispatch(onCreate(model))
  vnode.state = {
    vnode: output,
    model: model
  }


  if(vnode.options.componentWillMount){
     vnode.options.componentWillMount();
   }

  //++

  if(vnode.state.vnode.type =="thunk"){
    throw new Error("组件的跟元素必须是DOM元素");
  }
  //保留输出，setState，进行对比
  vnode.options.vnode= vnode.options.rootVnode= vnode.state.vnode;
  vnode.options.node = vnode.options.nativeNode= vnode.options.rootNode =  DOMElement;
  vnode.options.output = vnode.state.vnode;
  vnode.nativeNode = DOMElement;
  DOMElement.vnode = vnode.options;


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

  return DOMElement
}
