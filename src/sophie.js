

var Register = require("./register")
var Element = require("./element")
var mount = require("./mount");
import {dom,diff,element,vnode}  from "../lib/deku/src/index";



var Import = require("./import")
var StyleSheet = require("./styleSheet")
var Compontent = require("./compontent.js");
var Bootstrap = require("./bootstrap")
  var EE  = require("./event")

var Sophie = {
  runApp:Bootstrap.runApp,
  ready:Bootstrap.ready,
  renderElement:Bootstrap.renderElement,
  renderToJSON:Bootstrap.renderToJSON,
  renderFromJSON:Bootstrap.renderFromJSON,
  isBaseVnode:Bootstrap.isBaseVnode,

  getOwner:Bootstrap.getOwner,
  getParent:Bootstrap.getParent,
  closestBaseParent:Bootstrap.closestBaseParent,
  getBaseParent:Bootstrap.getBaseParent,

  getMainDocumentParent : Bootstrap.getBaseParent,
  isMainDocumentEl : Bootstrap.isBaseVnode,
  getMainDocumentEl : Bootstrap.closestBaseParent,

  createVnodeByTagName:Bootstrap.createVnodeByTagName,
  createVnodeByFun:Bootstrap.createVnodeByFun,

  createElementByVnode:Bootstrap.createElementByVnode,

  createElementByTagName:Bootstrap.createElementByTagName,
    renderVnodeFromJSON:Bootstrap.renderVnodeFromJSON,
  mountElement:mount,
  element : Element,
  register:Register.register,
  createClass:Compontent,
  import:Import,
  createStyleSheet:StyleSheet.create,
  StyleSheet:StyleSheet,
  on:function(){
    EE.on.apply(EE,arguments);
  },
  isLeaf:Register.isLeaf,
  isSophie:Register.isLeaf,
  upgrade:Register.upgrade,
  registry:Register.registry,
  upgradeDocument:Register.upgradeDocument,
  isThunk:function (node) {
    return node.type === 'thunk';
  }

}

window.Sophie = Sophie;
module.exports = Sophie;
