import {isText, isThunk, isSameThunk, isNative, isEmpty, groupByKey, createPath} from '../element'
import dift, * as diffActions from './dift'
import isUndefined from '@f/is-undefined'
import isNull from '@f/is-null'
import Type from 'union-type'
let Any = () => true
let Path = () => String

/**
 * Patch actions
 */

export let Actions = Type({
  setHTML: {newValue:String, oldValue:String},
  setAttribute: {attrName:String, newValue:Any, oldValue:Any},
  removeAttribute: {attrName:String, value:Any},
  insertChild: {node:Any, index:Number, path:Path},
  removeChild: {index:Number, node:Any},
  updateChild: {index:Number, actions:Array},
  updateChildren: {childrenChanges:Array},
  insertBefore: {index:Number},
  replaceNode: {oldNode:Any, newNode:Any, path:Path,  placeHolder:Any},
  removeNode: {node:Any},
  sameNode: {node:Any},
  updateThunk: {oldThunk:Any, newThunk:Any, Path}
})

/**
 * Diff two attribute objects and return an array of actions that represent
 * changes to transform the old object into the new one.
 */


export function diffAttributes (previous, next) {
  let { setAttribute, removeAttribute } = Actions
  let changes = []
  let pAttrs = previous.attributes
  let nAttrs = next.attributes

  for (let name in nAttrs) {
    if (nAttrs[name] !== pAttrs[name]) {
      changes.push(setAttribute(name, nAttrs[name], pAttrs[name]))
    }
  }

  for (let name in pAttrs) {
    if (!(name in nAttrs)) {
      changes.push(removeAttribute(name, pAttrs[name]))
    }
  }

  return changes
}

/**
 * Compare two arrays of virtual nodes and return an array of actions
 * to transform the left into the right. A starting path is supplied that use
 * recursively to build up unique paths for each node.
 */

export function diffChildren (previous, next, parentPath) {
  let { insertChild, updateChild, removeChild, insertBefore, updateChildren } = Actions
  let { CREATE, UPDATE, MOVE, REMOVE } = diffActions
  let previousChildren = groupByKey(previous.children)
  let nextChildren = groupByKey(next.children)
  let key = a => a.key

  let changes = []


  let equal = function(prev, next){

    // No left node to compare it to
    // TODO: This should just return a createNode action
    if (isUndefined(prev)) {
      throw new Error('Left node must not be null or undefined')
    }

    // Bail out and skip updating this whole sub-tree
    if (prev === next) {
      return true
    }

    if((prev.key&&prev.key) == (next.key&&next.key)){
      return true;
    }

    if((prev.nativeNode&&prev.nativeNode) == (next.nativeNode&&next.nativeNode)){
      return true;
    }


    // Native
    if (isNative(prev)&&isNative(next)) {
      if (prev.tagName == next.tagName) {
        return true;
      }
    }

    // Text
    if (isText(prev)&&isText(next)) {
      if (prev.nodeValue == next.nodeValue) {
        return true;
      }

    }
    // html
    if (prev.type == "html"&&prev.type == "html") {
      if (prev.nodeValue == next.nodeValue) {
        return true;
      }
    }

    // Thunk
    if (isThunk(prev)&&isThunk(next)) {
      if (isSameThunk(prev, next)) {
        return true;
      }
    }
  }


  function effect (type, prev, next, pos) {
    let nextPath = next
      ? createPath(parentPath, next.key == null ? next.index : next.key)
      : null
    switch (type) {
      case CREATE: {
        //创建placeholder
        changes.push(insertChild(
          next.item,
          pos,
          nextPath
        ))
        break
      }
      case UPDATE: {
        let actions = diffNode(
          prev.item,
          next.item,
          nextPath,
            prev.index
        )
        if (actions.length > 0) {
          changes.push(updateChild(prev.index, actions))
        }
        break
      }
      case MOVE: {
        let actions = diffNode(
          prev.item,
          next.item,
          nextPath,
            prev.index
        )
        actions.push(insertBefore(pos))
        changes.push(updateChild(prev.index, actions))
        break
      }
      case REMOVE: {
        changes.push(removeChild(prev.index, prev.item))
        break
      }
    }
  }

  dift(previousChildren, nextChildren, effect, equal)

  return updateChildren(changes)
}

/**
 * Compare two virtual nodes and return an array of changes to turn the left
 * into the right.
 */

export function diffNode (prev, next, path, index) {
  let {replaceNode, setAttribute,setHTML, sameNode, removeNode, updateThunk} = Actions

  // No left node to compare it to
  // TODO: This should just return a createNode action
  if (isUndefined(prev)) {
    throw new Error('Left node must not be null or undefined')
  }

  // Bail out and skip updating this whole sub-tree
  if (prev === next) {
    return [sameNode(next)]
  }

  // Remove
  if (!isUndefined(prev) && isUndefined(next)) {
    return [removeNode(prev)]
  }

  // Replace with empty
  if (!isNull(prev) && isNull(next) || isNull(prev) && !isNull(next)) {
    return [replaceNode(prev, next, path, undefined)]
  }

  // Replace
  if (prev.type !== next.type) {
    return [replaceNode(prev, next, path, undefined)]
  }

  // Native
  if (isNative(next)) {
    if (prev.tagName !== next.tagName) {
      return [replaceNode(prev, next, path,undefined)]
    }
    let changes = diffAttributes(prev, next)
    changes.push(diffChildren(prev, next, path))
    return changes
  }

  // Text
  if (isText(next)) {
    let changes = []
    if (prev.nodeValue !== next.nodeValue) {
      changes.push(setAttribute('nodeValue', next.nodeValue, prev.nodeValue))
    }
    return changes
  }
  if (next.type == "html") {
    let changes = []
    if (prev.nodeValue !== next.nodeValue) {
      changes.push(setHTML(next.nodeValue, prev.nodeValue))
    }
    return changes
  }

  // Thunk
  if (isThunk(next)) {
    let changes = []
    if (isSameThunk(prev, next)) {
      changes.push(updateThunk(prev, next, path))
    } else {

      //插入placeholder
        var node = prev.nativeNode
        var parent = node.parentNode
        if(node){
          var placeholder = document.createElement("span");
          placeholder.style="display:none";
          parent.insertBefore(placeholder,node)
        }


      changes.push(replaceNode(prev, next, path, placeholder))
    }
    return changes
  }

  // Empty
  if (isEmpty(next)) {
    return []
  }

  return []
}
