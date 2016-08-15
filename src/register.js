
var utils = require("./utils");
var EE  = require("./event")
var element = require("./element");
import {dom,diff,vnode}   from "../lib/deku/src/index";
var StyleSheet = require("./styleSheet");
var merge = require("merge");
var currentOwner = require("./currentOwner");
var registry = {};

function register(inName, inOptions) {

    if(!inOptions){
      inOptions = inName;
      inName = "undefined"
    }

    var definition = inOptions || {};
    definition.name = inName|| definition.name ;

    if (!inName) {
        throw new Error('Name argument must not be empty');
    }

    resolveTagName(definition);
    resolveMixin(definition);

    var SohpieConstructor = function () {
      this.state = {}
      this.props = {}
      this.children = []
      this.refs = {}

      var defaultProps = this.getDefaultProps&&this.getDefaultProps();
      var newProps = merge.recursive(defaultProps||{}, this.props)
      this.props = newProps;
      this.attributes = newProps

      var defaultState = this.getInitialState&&this.getInitialState()
      var newState = merge.recursive({},defaultState||{})
      this.state = newState

    }


    var oldRender =  definition.render
    var oldComponentDidMount = definition.componentDidMount
    var oldComponentWillMount = definition.componentWillMount
    var componentDidInsert = definition.componentDidInsert
    var componentDidInsert = definition.componentDidInsert
    var getDefaultChildren = definition.getDefaultChildren;

    SohpieConstructor.prototype = definition;

    if(getDefaultChildren){
      SohpieConstructor.prototype.getDefaultChildren = function(){
        currentOwner.target = this._owner;
       var result =  getDefaultChildren.apply(this, arguments);
        currentOwner.target = undefined;
        return currentOwner;
      }
    }


    SohpieConstructor.prototype.render = function(){
       currentOwner.target = this;
      var result =  oldRender.apply(this, arguments);
       currentOwner.target = undefined;
       return result;
    }

    // if(Sophie&&Sophie.renderRootElement){
    //   SohpieConstructor.prototype.render = function(){
    //     return this.element(this.name, this.attributes, oldRender.apply(this, arguments))
    //   }
    // }


    SohpieConstructor.prototype.componentDidMount = function(){
     oldComponentDidMount&&oldComponentDidMount.apply(this, arguments)
       EE.trigger("componentDidMount",[this.node])
    }

    SohpieConstructor.prototype.componentDidInserted = function(){
      oldComponentDidInserted&&oldComponentDidInserted.apply(this, arguments)
       EE.trigger("componentDidInsert",[this.node])
    }

    SohpieConstructor.prototype.componentWillMount = function(){
      oldComponentWillMount&&oldComponentWillMount.apply(this, arguments)
       EE.trigger("oldComponentWillMount",[this.node])
    }

    //for decleare
    // SohpieConstructor.prototype.getDefaultProps = function(){}
    // SohpieConstructor.prototype.getInitialState = function(){}

    SohpieConstructor.prototype.setState = function(value){

       this.state =  merge.recursive(this.state ,value);
       this._update();

    }

    // //重置render方法，生成根元素
    // var oRender = definition.render;
    // SohpieConstructor.prototype.render = function(){
    //   return element(this.name,this.props,oRender.apply(this,arguments));
    // }


    SohpieConstructor.prototype.forceUpdate=SohpieConstructor.prototype._update = function(){
        // debugger
        var oldVnode = this.rootVnode;
        var newVnode = this.render();


        let changes = diff.diffNode(oldVnode, newVnode, this.id || '0')
        var node = changes.reduce(dom.updateElement(function(){}, this), this.nativeNode)

        this.rootVnode = newVnode;
        this.nativeNode = node;
        return node


    }


    SohpieConstructor.prototype.element = function(){
      var vnode = element.apply(null, arguments)

      return vnode;
    },

    SohpieConstructor.prototype.append =function(child){
          var children = this.children;
          child.parent = this
          children.push(child);
          this._update()
          if(child.componentDidInsert){
            child.componentDidInsert();
          }
    }

    SohpieConstructor.prototype.remove =function(child){
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
    }

    SohpieConstructor.prototype.insertBefore =function(target, before){
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
    }

    SohpieConstructor.prototype.insertAfter =function(target, after){
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

    SohpieConstructor.createStyleSheet = function(styles,mediaQuery){
      StyleSheet.create(styles,mediaQuery, inName)
    }



  if(inName!=="undefined"){
    registerDefinition(inName, SohpieConstructor);
    document.createElement(inName);
  }

  SohpieConstructor.prototype.constructor = SohpieConstructor


  return SohpieConstructor;
}

function resolveTagName(inDefinition) {
    inDefinition.tagName = inDefinition.name;
    inDefinition.type = inDefinition.name;
}


function resolveMixin(inDefinition) {
    var mixin= inDefinition.mixin||[];
    for(var i=0;i<mixin.length;i++){
        var pName = mixin[i];
      var pDefinition = registry[pName] || {};
      for (var p in pDefinition) {
          if (!inDefinition[p]) {
              inDefinition[p] = pDefinition[p];
          }
      }
    }
}

function registerDefinition(inName, inDefinition) {
    registry[inName] = inDefinition;
}









function isLeaf(inElement){
    if(inElement){
        var name = inElement.tagName.toLowerCase();
        return registry[name];
    }
}


var isReady = false;


module.exports = {

  registry : registry,
  isLeaf : isLeaf,

  register : register
}
