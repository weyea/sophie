//bootstrap


import {dom, diff, element, vnode, createApp} from "../lib/deku/src/index";
import {mountElement} from "../lib/deku/src/dom/mount";

var utils = require("./utils")
var Register = require("./register")
var Element = require("./element");
var EE = require("./event")
var StyleSheet = require("./styleSheet");
var mount = require("./mount");
var merge = require("merge");

var currentOwner = require("./currentOwner");


var head = document.getElementsByTagName("head")[0];
var style = document.createElement("style");
style.innerText = "body{opacity:0;filter:alpha(opacity=0)}";


var isReady = false
var callbacks = []
var ready = function (callback) {
    if (isReady) {
        callback && callback()
    }
    else {
        callbacks.push(callback)
    }
}

var fireReady = function () {
    if (!isReady) return;
    for (var i = 0; i < callbacks.length; i++) {
        callbacks[i] && callbacks[i]();
    }
}


module.exports = {
    runApp: function (compontent, props, container, fire) {
        // utils.ready(function () {
        var container = container ? container : document.body
        let render = createApp(container)
        var vnode = Element(compontent, props, null);
        Sophie.firstVnode = Sophie.app = vnode
        render(vnode);
        mountElement(vnode);
        if (!isReady) {
            isReady = true;
            if (fire !== false) {
                EE.trigger("ready", [vnode])
                fireReady();
            }
        }
        return vnode;
    },

    ready: ready,
    renderToJSON: function (outVnode, state) {
        // app
        //isPlainObject
        var outVnode = outVnode || Sophie.firstVnode.rootVnode;
        var walk = function (vnode) {

            var currentData = {};
            var children;

            if (vnode.children && vnode.children.length) {
                children = vnode.children;
            }
            if (vnode.attributes && vnode.attributes.children) {
                children = vnode.attributes.children;
            }
            if (vnode.props && vnode.props.children) {
                children = vnode.props.children;
            }
            if (!Array.isArray(children)) {
                children = [children];
            }

            if (Sophie.isThunk(vnode)) {
                var component = vnode;

                currentData.type = "thunk"
                // currentData.state = component.state
                var attributes = {};


                var excepts = {
                    "children": 1,
                    "className": 1,
                    "class": 1,
                    "paddingBottom": 1,
                    "ref": 1,
                    "active": 1,
                    "title": 1,
                    "isHidden": 1,
                    "heightAuto": 1

                }
                var inputProps = component.inputProps
                var vnodeProps = component.props;
                var vnodeDefaultProps = component.defaultProps;
                var mergeProps = {}
                for (var p in vnodeProps) {
                    if (!excepts[p] || inputProps[p]) {
                        if (!vnodeDefaultProps[p] || vnodeDefaultProps[p] !== vnodeProps[p]) {
                            mergeProps[p] = vnodeProps[p]
                        }
                    }
                }


                attributes = utils.extend(2, {}, mergeProps)
                delete attributes.children

                currentData.props = attributes
                if (state) {

                    currentData.state = utils.extend(2, {}, component.state)
                }
                currentData.name = component.name
            }
            else if (vnode.type == "text") {
                currentData.type = vnode.type
                currentData.nodeValue = vnode.nodeValue

            }
            else if (vnode.type == "html") {
                currentData.type = vnode.type
                currentData.nodeValue = vnode.nodeValue

            }
            else if (vnode.type == "native") {
                currentData.type = "native"
                currentData.tagName = vnode.tagName;

                currentData.props = utils.extend(1, {}, vnode.props)
                if (currentData.props.children) {
                    delete  currentData.props.children;
                }

            }
            currentData.children = [];

            if (vnode.tagName !== "p-list-dataset") {
                if (children && children.length) {
                    for (var i = 0; i < children.length; i++) {
                        if (children[i]) currentData.children.push(walk(children[i]))
                    }
                }
            }

            if (!currentData.type) {
                currentData = undefined;
            }
            return currentData;
        }

        var data = walk(outVnode);
        return data

    },

    renderVnodeFromJSON: function (json, ownerDocument, callback) {
        var funcEl = function (c) {
            var result = callback && callback(c)

            if (result === false) return;
            if (c.type == "thunk") {

                if (c.state) {
                    c.props.__state = c.state;
                }
                return Sophie.element(Sophie.registry[c.name], c.props, funChildren(c.children))
            }
            else if (c.type == "text") {

                return {
                    type: 'text',
                    nodeValue: c.nodeValue
                }
            }
            else if (c.type == "html") {

                return {
                    type: 'html',
                    nodeValue: c.nodeValue
                }
            }
            else if (c.type = "native") {
                return Sophie.element(c.tagName, c.props, funChildren(c.children))
            }
        }
        var funChildren = function (children) {
            var result = []
            for (var i = 0; i < children.length; i++) {
                var c = children[i];
                if (!c || !c.type) continue;

                var el = funcEl(c);
                if (el) {
                    result.push(el)
                }
            }

            return result;
        }

        var oldOwnerDocument = currentOwner.target
        currentOwner.target = ownerDocument;
        var result = funcEl(json)
        currentOwner.target = oldOwnerDocument || undefined;
        return result;
    },
    renderFromJSON: function (data, container, callback) {
        var htmlData = data;
        var self = this
        if (htmlData) {
            var site = htmlData;
            var APP = Sophie.createClass("app", {
                render: function () {
                    return self.renderVnodeFromJSON(data, this)
                }
            })

            Sophie.runApp(APP, container || $("#dotlinkface").get(0), true)
        }

        setTimeout(function () {
            callback && callback()
        }, 0)

    },
    //第个组件生成元素
    isBaseVnode: function (vnode) {
        return vnode.ownerDocument && vnode.ownerDocument == Sophie.firstVnode
    },


    getOwner: function (vnode) {

        return vnode.ownerDocument || vnode.ownerDocument;

    },
    getCreater: function (vnode) {

        return vnode.ownerDocument || vnode.ownerDocument;

    },

    getParent: function (vnode) {
        return vnode.parent;
    },
    closestBaseParent: function (vnode) {
        if (!vnode) {
            return;
        }
        if (this.isBaseVnode(vnode)) {
            return vnode;
        }
        else {
            var owner = this.getOwner(vnode);
            return this.closestBaseParent(owner);

        }

    },
    getBaseParent: function (vnode) {
        var parent = this.getParent(vnode);
        if (this.isBaseVnode(parent)) {
            return parent;
        }
        else {
            var owner = this.getOwner(parent);
            if (owner) {
                return this.closestBaseParent(owner);
            }

        }
    },


    cloneVnode: function (vnode) {
        var name = vnode.name;

        var newVnode = createVnodeByTagName(name);
        newVnode.attributes = newVnode.props = vnode.attributes
        newVnode.state = vnode.state;


    },
    createVnodeByTagName: function (name, attributes, children) {
        var compontent = Register.registry[name];
        if (!compontent) throw new Error("name 没有注册");

        currentOwner.target = Sophie.firstVnode

        var vnode = Element(compontent, attributes || {}, children || null);
        currentOwner.target = undefined;
        return vnode;
    },
    createVnodeByFun: function (fun) {
        currentOwner.target = Sophie.firstVnode;
        var vnode = fun();
        currentOwner.target = undefined;
        return vnode;
    },

    createElementByVnode: function (vnode) {

        return dom.createElement(vnode, 0)
    },

    createElementByTagName: function (name, attributes, children) {

        var vnode = this.createVnodeByTagName(name, attributes, children || null)

        return this.createElementByVnode(vnode)
    }

}


