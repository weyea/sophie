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

var SohpieConstructor = function (props, children, owner) {
    if (owner) {
        this.owner = owner
        this.ownerDocument = owner
    }
    this.state = {}
    this.refs = {}
    this.props = props || {}
    this.children = children
    this.props.children = children || []

    initClass.apply(this, [SohpieConstructor, undefined, props, children, owner])

}


// //重置render方法，生成根元素
// var oRender = definition.render;
// SohpieConstructor.prototype.render = function(){
//   return element(this.name,this.props,oRender.apply(this,arguments));
// }


var baseClassPrototype = {


    _constructor: function () {

    },
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
        this.state = merge(this.state, value);
        this._update();
    },

    setProps: function (value) {
        if (this.componentWillSetProps) {
            this.componentWillSetProps(value);
        }
        //设置属性
        this.props = merge(this.props, value);
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

    append: function (child) {
        child.parent = this
        child.owner = child.creater = this.owner
        var children = this.props.children;
        children.push(child);
        this._update()
        if (this.componentDidInsertChild) {
            this.componentDidInsertChild(child);
        }
    },

    setChildren: function (children) {
        var result = [];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            child.parent = this;
            child.owner = child.creater = this.owner
            result.push(child)
        }
        this.props.children = this.children = this.attributes.children = result;
        if (this.componentDidSetChildren) {
            this.componentDidSetChildren(children);
        }
    },

    remove: function (child) {
        var parent = this;
        var children = parent.children;
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
        var children = parent.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == before) {
                children.splice(i, 0, target)

                target.parent = parent
                break;
            }
        }
        this._update()
        if (target.componentDidInsert) {
            target.componentDidInsert();
        }
    },
    insertAfter: function (target, after) {
        var parent = this;
        var children = parent.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == after) {
                children.splice(i + 1, 0, target)
                target.parent = parent

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