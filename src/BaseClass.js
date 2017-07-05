var merge = require("merge");

var element = require("./element");
import {dom,diff,vnode}   from "../lib/deku/src/index";

var SohpieConstructor = function (props) {
    this.state = {}
    this.props = props || {}
    this.children = []
    this.refs = {}
    var defaultProps = this.getDefaultProps&&this.getDefaultProps();
    var newProps = merge.recursive(defaultProps||{}, props||{})
    this.props = newProps;
    this.attributes = newProps
    var defaultState = this.getInitialState&&this.getInitialState()
    var newState = merge.recursive({},defaultState||{})
    this.state = newState

}



// //重置render方法，生成根元素
// var oRender = definition.render;
// SohpieConstructor.prototype.render = function(){
//   return element(this.name,this.props,oRender.apply(this,arguments));
// }



var baseClassPrototype = {
    forceUpdate: function(){
        // debugger
        var oldVnode = this.rootVnode;
        var newVnode = this.render();

        let changes = diff.diffNode(oldVnode, newVnode, this.id || '0')
        var node = changes.reduce(dom.updateElement(function(){}, this), this.nativeNode)

        this.rootVnode = newVnode;
        this.nativeNode = node;
        return node
    },
    setState : function(value){
        this.state =  merge.recursive(this.state ,value);
        this._update();
    },
    setProps: function(value){
        this.state =  merge.recursive(this.props ,value);
        this._update();
    },
    element : function(){
        var vnode = element.apply(null, arguments)
        return vnode;
    },
    render : function(){
    },
    append :function(child){
        var children = this.children;
        child.parent = this
        children.push(child);
        this._update()
        if(child.componentDidInsert){
            child.componentDidInsert();
        }
    },

    setChildren : function(children){
        var result = [];
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            child.parent = this;
            result.push(child)
        }
        this.props.children = this.children = this.attributes.children = result;
    },

    remove : function(child){
        var parent = this;
        var children = parent.children;
        for(var i=0; i<children.length;i++){
            if(children[i] == child){
                //  children[i].parent = undefined
                children.splice(i,1)

                break;
            }
        }
        this._update()
        if(child.componentDidRemove){
            child.componentDidRemove();
        }
    },
    insertBefore :function(target, before){
        var parent = this;
        var children = parent.children;
        for(var i=0; i<children.length;i++){
            if(children[i] == before){
                children.splice(i,0, target)

                target.parent = parent
                break;
            }
        }
        this._update()
        if(target.componentDidInsert){
            target.componentDidInsert();
        }
    },
    insertAfter : function(target, after){
        var parent = this;
        var children = parent.children;
        for(var i=0; i<children.length;i++){
            if(children[i] == after){
                children.splice(i+1,0, target)
                target.parent = parent

                break;
            }
        }
        this._update()
        if(target.componentDidInserted){
            target.componentDidInsert();
        }
    }
}


baseClassPrototype._update = baseClassPrototype.forceUpdate


merge(SohpieConstructor.prototype ,baseClassPrototype);




SohpieConstructor.prototype.constructor = SohpieConstructor

module.exports = SohpieConstructor;