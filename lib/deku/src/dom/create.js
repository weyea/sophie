import createNativeElement from './_create-element'
import {createPath} from '../element'
import {setAttribute} from './setAttribute'
import isUndefined from '@f/is-undefined'
import isString from '@f/is-string'
import isNumber from '@f/is-number'
import isNull from '@f/is-null'

const cache = {}
import * as create from './_create'


export function createElement(vnode, path, dispatch, context) {

    vnode.isRender = true;
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




function getCachedElement(type) {
    let cached = cache[type]
    if (isUndefined(cached)) {
        cached = cache[type] = createNativeElement(type)
    }
    return cached.cloneNode(false)
}

function createThunk(vnode, path, dispatch, context) {
    if (vnode.type == "thunk" && (vnode.props.key || vnode.props.id || vnode.key || vnode.id || vnode.innerKey)) {
        if (vnode.rootNode) {
            return vnode.rootNode
        }
    }

    if (vnode.componentWillMount) {
        vnode.componentWillMount();
    }


    let {props, children} = vnode
    let {onCreate} = vnode

    let model = {
        children,
        props,
        path,
        dispatch,
        context
    }

    let output = vnode.render(model);
    var DOMElement = {};
    if (output) {
        let childPath = createPath(path, output.key || '0');
        DOMElement = createElement(output, childPath, dispatch, context)
        var id = vnode.attributes.id || vnode.attributes.key
        if (id) {
            setAttribute(DOMElement, "id", id);
        }

        if (output.type == "thunk") {
            throw new Error("组件的跟元素必须是DOM元素");
        }
        vnode.rootVnode = output;
        vnode.nativeNode = vnode.rootNode = DOMElement;
        vnode.output = output;

        if (onCreate) dispatch(onCreate(model))

        //++
        //保留输出，setState，进行对比

        DOMElement.vnode = vnode;
        DOMElement.rootVnode = vnode;
        DOMElement.vnodeInstance = vnode;
        return DOMElement;
    }


}


function createHTMLElement(vnode, path, dispatch, context) {
    let {tagName, attributes, children} = vnode
    if(tagName == "article"){
        return createFragment(vnode, path, dispatch, context)
    }

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

    vnode.nativeNode = vnode.rootNode = DOMElement;


    return DOMElement
}


function createFragment(vnode,path, dispatch, context) {
    let {tagName, attributes} = vnode
    let DOMElement = getCachedElement(tagName)

    for (let name in attributes) {
        if (name == "html") {
            DOMElement.innerHTML = attributes[name]
        }
        else {
            setAttribute(DOMElement, name, attributes[name])
        }
    }


    DOMElement.vnode = vnode

    vnode.nativeNode = vnode.rootNode = DOMElement;


    return DOMElement
}