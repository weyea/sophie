import * as dom from '../dom'
import {diffNode} from '../diff'
import empty from '@f/empty-element'
import noop from '@f/noop'

/**
 * Create a DOM renderer using a container element. Everything will be rendered
 * inside of that container. Returns a function that accepts new state that can
 * replace what is currently rendered.
 */

export function createApp (container, handler = noop, options = {}) {
  let oldVnode = null
  let node = null
  let rootId = options.id || '0'
  let dispatch = effect => effect && handler(effect)

  if (container) {
    empty(container)
  }

  let update = (newVnode, context) => {
    let changes = diffNode(oldVnode, newVnode, rootId)
    node = changes.reduce(dom.updateElement(dispatch, context), node)
    oldVnode = newVnode
    return node
  }

  let create = (vnode, context) => {
    node = dom.createElement(vnode, rootId, dispatch, context)
    if (container) container.appendChild(node)
    oldVnode = vnode
    return node
  }

  return (vnode, context = {}) => {
    return node !== null
      ? update(vnode, context)
      : create(vnode, context)
  }
}
