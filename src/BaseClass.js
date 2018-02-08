/**
 * parent: 为元素创建时所在vnode结构外层元素
 * creater：为元素创建时render方法所属于的元素
 * rootVnode：是组件的每一个根元素，根元素无parent，但有creater
 * nativeNode:是组件的每一个根元素相对应的dom元素，render方法渲染完成时生成
 */



var merge = require("merge");

var element = require("./element");

import {dom, diff, vnode} from "../lib/deku/src/index";

import {initClass} from "./InitClass"

var Utils = require('./utils')
//只作继承用
var SohpieConstructor = function () {

}


// //重置render方法，生成根元素
// var oRender = definition.render;
// SohpieConstructor.prototype.render = function(){
//   return element(this.name,this.props,oRender.apply(this,arguments));
// }


var baseClassPrototype = {

    // _constructor: function () {
    //
    //
    // },
    // getDefaultChildren: function () {
    //     return {}
    // },
    // getInitialState: function () {
    //     return {}
    // },

    forceUpdate: function (updateChildren) {
        // debugger

        if (this.props.children) {
            for (var i = 0; i < this.props.children.length; i++) {
                var props = this.props.children[i].props
                if (props) {
                    var key = props.id || props.key
                    this.props.children[i].innerKey = key || (i + 1)
                }

            }
        }
        var oldVnode = this.rootVnode;
        var newVnode = this.render();


        let changes = diff.diffNode(oldVnode, newVnode, this.id || '0')
        //@todo this.nativeNode是个什么角色
        var node = changes.reduce(dom.updateElement(function () {
        }, this), this.nativeNode)

        this.rootVnode = newVnode;
        this.nativeNode = node;

        if (updateChildren && this.props.children && this.props.children.length) {
            for (var i = 0; i < this.props.children.length; i++) {
                var child = this.props.children[i];
                if (child.isRender && child.forceUpdate) {
                    child.forceUpdate(updateChildren);
                }
            }
        }

        if (this.componentDidUpdate) {
            this.componentDidUpdate()
        }

        return node
    },
    setState: function (value) {
        this.state = Utils.extend(true, this.state, value);
        this._update();
    },

    setProps: function (value) {
        if (this.componentWillSetProps) {
            this.componentWillSetProps(value);
        }
        //设置属性
        this.props = Utils.extend(true, this.props, value);
        if (this.componentDidSetProps) {
            this.componentDidSetProps(value);
        }
        this._update();

    },
    element: function () {
        var vnode = element.apply(null, arguments)
        return vnode;
    },
    render: function () {
    },

    addChild: function (child) {
        child.parent = this
        var children = this.props.children;
        children.push(child);
    },
    _addOwnerDocument: function (child, parent) {
        child.parent = parent || this
        child.ownerDocument = child.owner = child.creater = this.owner
        if (child.props.children) {
            for (var i = 0; i < child.props.children.length; i++) {
                this._addOwnerDocument(child.props.children[i], child)
            }
        }


    },

    append: function (child, forceUpdate) {
        this._addOwnerDocument(child)
        var children = this.props.children;
        children.push(child);
        if (forceUpdate !== false) {
            this._update()
            if (this.componentDidInsertChild) {
                this.componentDidInsertChild(child);
            }
        }

    },

    unshift: function (child, forceUpdate) {
        this._addOwnerDocument(child)
        var children = this.props.children;
        children.unshift(child);
        if (forceUpdate !== false) {
            this._update()
            if (this.componentDidInsertChild) {
                this.componentDidInsertChild(child);
            }
        }

    },

    setChildren: function (children) {
        var result = [];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            this._addOwnerDocument(child)
            result.push(child)
        }
        this.props.children = this.children = this.attributes.children = result;
        if (this.componentDidSetChildren) {
            this.componentDidSetChildren(children);
        }
    },

    remove: function (child) {
        var parent = this;
        var children = parent.props.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == child) {
                //  children[i].parent = undefined
                children.splice(i, 1)

                break;
            }
        }
        this._update()
        if (child.componentDidRemoveChild) {
            child.componentDidRemoveChild(child);
        }
    },
    insertBefore: function (target, before) {
        var parent = this;
        this._addOwnerDocument(target)
        var children = parent.props.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == before) {
                children.splice(i, 0, target)


                break;
            }
        }
        this._update()
        if (target.componentDidInsert) {
            target.componentDidInsert();
        }
    },

    replaceChild: function(replaceChild, newChild){
        var parent = this;
        this._addOwnerDocument(newChild)
        var children = parent.props.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == replaceChild) {
                children[i] = newChild;
                break;
            }
        }
        this._update()
    },
    insertAfter: function (target, after) {
        var parent = this;
        this._addOwnerDocument(target)
        var children = parent.props.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == after) {
                children.splice(i + 1, 0, target)

                break;
            }
        }
        this._update()
        if (target.componentDidInsertChild) {
            target.componentDidInsertChild();
        }
    }
}


baseClassPrototype._update = baseClassPrototype.forceUpdate


Utils.merge(SohpieConstructor.prototype, baseClassPrototype);


SohpieConstructor.prototype.constructor = SohpieConstructor


module.exports = SohpieConstructor;