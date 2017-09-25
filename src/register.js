
var Utils = require("./utils");
var EE  = require("./event")
var element = require("./element");
import {dom,diff,vnode}   from "../lib/deku/src/index";
var StyleSheet = require("./styleSheet");
var merge = require("merge");
var currentOwner = require("./currentOwner");
var registry = {};
var SophieBaseClass = require("./BaseClass")

import {initClass} from "./InitClass"

function register(inName, inOptions, ExtendClass) {

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

    ExtendClass = ExtendClass || SophieBaseClass

    //只能扩展Sophie类
    if(ExtendClass == SophieBaseClass || ExtendClass.prototype instanceof  SophieBaseClass){
        var SohpieConstructor = function (props, children, owner) {

            ExtendClass.apply(this, arguments)
            initClass.apply(this, [SohpieConstructor, ExtendClass, props, children, owner])
        }
        SohpieConstructor.prototype = Object.create(ExtendClass.prototype)
        SohpieConstructor.prototype.constructor = SohpieConstructor

    }
    else{
        var SohpieConstructor = function (props, children, owner) {
            SophieBaseClass.apply(this, arguments)
            initClass.apply(this, [SohpieConstructor, SophieBaseClass, props, children, owner])
        }
        SohpieConstructor.prototype = Object.create(SophieBaseClass.prototype)
        SohpieConstructor.prototype.constructor = SohpieConstructor

    }


    var oldConstructor =  definition.constructor
    var oldRender =  definition.render
    var oldComponentDidMount = definition.componentDidMount
    var oldComponentWillMount = definition.componentWillMount
    var oldComponentDidUpdate = definition.componentDidUpdate


    var componentDidInsertChild = definition.componentDidInsertChild

    var getDefaultChildren = definition.getDefaultChildren;
    var componentDidSetChildren = definition.componentDidSetChildren;

    if(oldConstructor) {
        definition._constructor = oldConstructor;
    }
    else{
        definition._constructor = function(){}
    }

    if(getDefaultChildren){
        definition.getDefaultChildren = function(){
            var result =  getDefaultChildren.apply(this, arguments);
            if(!result){
                return []
            }
            for(var i = 0;i<result.length;i++){
                result[i].parent = this;
            }
            return result;
        }
    }

    //for decleare
    // SohpieConstructor.prototype.getDefaultProps = function(){}
    // SohpieConstructor.prototype.getInitialState = function(){}
    definition._initProps = function(props, children, owner){
        var defaultProps = this.getDefaultProps&&this.getDefaultProps();
        var newProps = merge(defaultProps||{},this.props||{},  props||{})
        this.props =this.attributes =  newProps;

        if (!children ||children.length == 0) {
            if (this.getDefaultChildren) {
                var defaultChildren = this.getDefaultChildren();
                if (Array.isArray(defaultChildren)) {
                    this.props.children = defaultChildren;
                }
                else {
                    this.props.children = [defaultChildren]
                }
            }
        }

        var defaultState = this.getInitialState&&this.getInitialState()
        var newState = merge({},defaultState||{},this.state||{})
        this.state = newState
    }

    if(oldRender){
        definition.render =  function(){
            currentOwner.target = this;
            var result =  oldRender.apply(this, arguments);
            currentOwner.target = undefined;
            return result;
        }
    }

    if(oldComponentDidMount){
        definition.componentDidMount = function(){
            if(!this._didMount){
                this._didMount = true
                oldComponentDidMount&&oldComponentDidMount.apply(this, arguments)
                EE.trigger("componentDidMount",[this])
            }

        }
    }
    if(oldComponentDidMount){
        definition.componentDidUpdate = function(){
                oldComponentDidUpdate&&oldComponentDidUpdate.apply(this, arguments)
                EE.trigger("componentDidUpdate",[this])
        }
    }


    if(componentDidInsertChild){
        definition.componentDidInserted = function(){
            componentDidInsertChild&&componentDidInsertChild.apply(this, arguments)
            EE.trigger("componentDidInsertChild",[this])
        }
    }

    if(componentDidSetChildren){
        definition.componentDidSetChildren = function(){
            componentDidSetChildren&&componentDidSetChildren.apply(this, arguments)
            EE.trigger("componentDidSetChildren",[this])
        }
    }

    if(oldComponentWillMount){
        definition.componentWillMount = function(){
            oldComponentWillMount&&oldComponentWillMount.apply(this, arguments)
            EE.trigger("oldComponentWillMount",[this])
        }
    }




    Utils.merge(SohpieConstructor.prototype ,definition);
    SohpieConstructor.prototype.constructor = SohpieConstructor


    SohpieConstructor.createStyleSheet = function(styles,mediaQuery){
        StyleSheet.create(styles,mediaQuery, inName)
    }



    if(inName!=="undefined"){
        registerDefinition(inName, SohpieConstructor);
        document.createElement(inName);
    }

    return SohpieConstructor;
}

function resolveTagName(inDefinition) {
    inDefinition.tagName = inDefinition.name;
    inDefinition.type = inDefinition.name;
}


function resolveMixin(inDefinition) {
    var mixin= inDefinition.mixin||[];
    for(var i=0;i<mixin.length;i++){
        var pDefinition = mixin[i];
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
