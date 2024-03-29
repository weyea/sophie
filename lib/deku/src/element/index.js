import isUndefined from '@f/is-undefined'
import reduceArray from '@f/reduce-array'
import isString from '@f/is-string'
import isNumber from '@f/is-number'
import isNull from '@f/is-null'

/**
 * This function lets us create virtual nodes using a simple
 * syntax. It is compatible with JSX transforms so you can use
 * JSX to write nodes that will compile to this function.
 *
 * let node = element('div', { id: 'foo' }, [
 *   element('a', { href: 'http://google.com' },
 *     element('span', {}, 'Google'),
 *     element('b', {}, 'Link')
 *   )
 * ])
 */

export function create(type, attributes, ...children) {
    if (!type) throw new TypeError('element() needs a type.')
    attributes = attributes || {}
    var props = attributes;


    children = reduceArray(reduceChildren, [], children || [])

    var newChildren = [];
    if (children && children.length) {
        for (var i = 0; i < children.length; i++) {
            if (typeof children[i] == "string" && children[i].trim() == "") {
                continue;
            }

            if (children[i]) {
                newChildren.push(children[i]);
            }
        }
    }

    let key = isString(attributes.key) || isNumber(attributes.key)
        ? attributes.key
        : null

    delete attributes.key

    if (typeof type === 'object') {
        return createThunkElement(type.render, key, attributes, children, type)
    }

    if (typeof type === 'function') {
        return createThunkElement(type, key, attributes, children, type)
    }

    props.children = children

    if (type === "article") {
        children = [];
        props.children = []
        return {
            type: 'native',
            tagName: type,
            attributes,
            children,
            props,
            key
        }
    }

    return {
        type: 'native',
        tagName: type,
        attributes,
        props,
        children,
        key
    }
}

/**
 * Cleans up the array of child elements.
 * - Flattens nested arrays
 * - Converts raw strings and numbers into vnodes
 * - Filters out undefined elements
 */

function reduceChildren(children, vnode) {
    if (isString(vnode) || isNumber(vnode)) {
        children.push(createTextElement(vnode))
    } else if (isNull(vnode)) {
        //children.push(createEmptyElement())
    } else if (Array.isArray(vnode)) {
        children = [...children, ...(vnode.reduce(reduceChildren, []))]
    } else if (isUndefined(vnode)) {
        //throw new Error(`vnode can't be undefined. Did you mean to use null?`)
    } else {
        children.push(vnode)
    }
    return children
}


export function reduceChildrenArray(children) {
    return reduceArray(reduceChildren, [], children || [])
}

/**
 * Text nodes are stored as objects to keep things simple
 */

export function createTextElement(text) {
    return {
        type: 'text',
        props: {},
        nodeValue: text
    }
}

/**
 * Text nodes are stored as objects to keep things simple
 */

export function createEmptyElement() {
    return {
        type: 'empty'
    }
}

/**
 * Lazily-rendered virtual nodes
 */

export function createThunkElement(fn, key, props, children, options) {
    return {
        type: 'thunk',
        fn,
        children,
        props,
        options,
        key
    }
}


/**
 * Functional type checking
 */


export let isThunk = (node) => {
    return node.type === 'thunk'
}

export let isText = (node) => {
    return node.type === 'text'
}

export let isEmpty = (node) => {
    return node.type === 'empty'
}

export let isNative = (node) => {
    return node.type === 'native'
}

export let isSameThunk = (left, right) => {
    var isSameType = isThunk(left) && isThunk(right) && left.constructor === right.constructor;


    if (left.nativeNode && right.nativeNode) {
        return (left.nativeNode == right.nativeNode) && isSameType
    }

    if (left.props.id || right.props.id) {
        return (left.props.id == right.props.id) && isSameType
    }

    if (left.props.key || right.props.key) {
        return (left.props.key == right.props.key) && isSameType
    }

    if (left.innerKey || right.innerKey) {
        return (left.innerKey == right.innerKey) && isSameType
    }


    return isSameType

    return
}

/**
 * Group an array of virtual elements by their key, using index as a fallback.
 */

export let groupByKey = (children) => {
    let iterator = (acc, child, i) => {
        if (!isUndefined(child) && child !== false) {
            let key = isNull(child) ? i : (child.key || i)
            acc.push({
                key: String(key),
                item: child,
                index: i
            })
        }
        return acc
    }

    return reduceArray(iterator, [], children)
}

/**
 * Create a node path, eg. (23,5,2,4) => '23.5.2.4'
 */

export let createPath = (...args) => {
    return args.join('.')
}
