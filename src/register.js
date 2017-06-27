
var utils = require("./utils");
var EE  = require("./event")
var element = require("./element");
import {dom,diff,vnode}   from "../lib/deku/src/index";
var StyleSheet = require("./styleSheet");
var merge = require("merge");
var currentOwner = require("./currentOwner");
var registry = {};
var SophieBaseClass = require("./BaseClass")

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
        var SohpieConstructor = function (props) {
            ExtendClass.apply(this, props)
        }

        SohpieConstructor.prototype = Object.create(ExtendClass.prototype)
    }
    else{
        var SohpieConstructor = function (props) {
            SophieBaseClass.apply(this, props)

        }
        SohpieConstructor.prototype = Object.create(SophieBaseClass.prototype)

    }


    var oldRender =  definition.render
    var oldComponentDidMount = definition.componentDidMount
    var oldComponentWillMount = definition.componentWillMount
    var componentDidInsert = definition.componentDidInsert
    var componentDidInsert = definition.componentDidInsert
    var getDefaultChildren = definition.getDefaultChildren;



    if(getDefaultChildren){
        definition.getDefaultChildren = function(){
            var result =  getDefaultChildren.apply(this, arguments);
            return result;
        }
    }

    //for decleare
    // SohpieConstructor.prototype.getDefaultProps = function(){}
    // SohpieConstructor.prototype.getInitialState = function(){}


    definition.render =  function(){
        currentOwner.target = this;
        var result =  oldRender.apply(this, arguments);
        currentOwner.target = undefined;
        return result;
    },

    definition.componentDidMount = function(){
        oldComponentDidMount&&oldComponentDidMount.apply(this, arguments)
        EE.trigger("componentDidMount",[this.node])
    }

    definition.componentDidInserted = function(){
        oldComponentDidInserted&&oldComponentDidInserted.apply(this, arguments)
        EE.trigger("componentDidInsert",[this.node])
    }

    definition.componentWillMount = function(){
        oldComponentWillMount&&oldComponentWillMount.apply(this, arguments)
        EE.trigger("oldComponentWillMount",[this.node])
    }

    merge(SohpieConstructor.prototype ,definition);
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
