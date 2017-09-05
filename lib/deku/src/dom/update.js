import {setAttribute, removeAttribute} from './setAttribute'
import {isThunk, createPath} from '../element'
import {Actions, diffNode} from '../diff'
import reduceArray from '@f/reduce-array'
import {createElement} from './create'
import toArray from '@f/to-array'
import forEach from '@f/foreach'
import noop from '@f/noop'

/**
 * Modify a DOM element given an array of actions.
 */

export function updateElement (dispatch, context) {
  return (DOMElement, action) => {
    if(!DOMElement) return;
    Actions.case({
      sameNode: noop,
      setAttribute: (name, value, previousValue) => {
        setAttribute(DOMElement, name, value, previousValue)
      },
      setHTML: (html) => {
        var div = document.createElement("div");
        div.innerHTML = html;
        var children = []
        for(var i =0; i < div.childNodes.length; i++){
          children[i] = div.childNodes[i];
        }
        for(var i =0; i < children.length; i++){
          DOMElement.appendChild(children[i]);
        }
    },

    removeAttribute: (name, previousValue) => {
        removeAttribute(DOMElement, name, previousValue)
      },
      insertBefore: (index) => {
        insertAtIndex(DOMElement.parentNode, index, DOMElement)
      },
      updateChildren: (changes) => {
        updateChildren(DOMElement, changes, dispatch, context)
      },
      updateThunk: (prev, next, path) => {
        DOMElement = updateThunk(DOMElement, prev, next, path, dispatch, context)
      },
      replaceNode: (prev, next, path, placeHolder) => {

        let parentEl = DOMElement.parentNode;
        if(placeHolder){
            var prevEl = placeHolder.nextSibling
            if(prevEl == prev){
                parentEl.removeChild(prev)
            }
            let newEl = createElement(next, path, dispatch, context)
            parentEl.replaceChild(newEl, placeHolder)

            DOMElement = newEl
        }
        else{
            let placeHolder = document.createElement("div");
            if (parentEl) {
                parentEl.replaceChild(placeHolder, DOMElement)
            }

            let newEl = createElement(next, path, dispatch, context)

            if (parentEl) {
                parentEl.replaceChild(newEl, placeHolder)
            }

            DOMElement = newEl
        }

        removeThunks(prev, dispatch)
      },
      removeNode: (prev) => {

        removeThunks(prev)
        DOMElement.parentNode.removeChild(DOMElement)
        DOMElement = null
      }
    }, action)

    return DOMElement
  }
}

/**
 * Update all the children of a DOMElement using an array of actions
 */

function updateChildren (DOMElement, changes, dispatch, context) {
  // Create a clone of the children so we can reference them later
  // using their original position even if they move around
  if(!DOMElement) return;
  let childNodes = toArray(DOMElement.childNodes)
  changes.forEach(change => {
    Actions.case({
      insertChild: (vnode, index, path) => {
        insertAtIndex(DOMElement, index, createElement(vnode, path, dispatch, context))
      },
      removeChild: (index) => {
        if(childNodes[index]&&childNodes[index].parentNode == DOMElement)DOMElement.removeChild(childNodes[index])
      },
      updateChild: (index, actions) => {
        let _update = updateElement(dispatch, context)
        actions.forEach(action => _update(childNodes[index], action))
      }
    }, change)
  })
}

/**
 * Update a thunk and only re-render the subtree if needed.
 */

function updateThunk (DOMElement, prev, next, path, dispatch, context) {
  if(!DOMElement) return;
  let { props, children } = next
  let { onUpdate } = next.options
  let prevNode = prev.rootVnode
  let model = {
    children,
    props,
    path,
    dispatch,
    context
  }
  let nextNode = next.fn(model)
  let changes = diffNode(prevNode, nextNode, createPath(path, '0'))
  DOMElement = reduceArray(updateElement(dispatch, context), DOMElement, changes)
  if (onUpdate) dispatch(onUpdate(model))
  next.rootVnode = nextNode;
  next.nativeNode = DOMElement;
  return DOMElement
}

/**
 * Recursively remove all thunks
 */

function removeThunks (vnode, dispatch) {
  while (vnode&&isThunk(vnode)) {
    let onRemove = vnode.options.onRemove
    let { model } = vnode.state
    if (onRemove) dispatch(onRemove(model))
    vnode = vnode.state.vnode
  }
  if (vnode&&vnode.props.children) {
    forEach(vnode.props.children, child => removeThunks(child, dispatch))
  }
}

/**
 * Slightly nicer insertBefore
 */

export let insertAtIndex = (parent, index, el) => {
  var target = parent.childNodes[index]
  if (target) {
    parent.insertBefore(el, target)
  } else {
    parent.appendChild(el)
  }
}
