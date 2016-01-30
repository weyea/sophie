

var Register = require("./register")
var Element = require("./element")
var Import = require("./import")
var StyleSheet = require("./styleSheet")
var Compontent = require("./compontent.js");
var Bootstrap = require("./bootstrap")
  var EE  = require("./event")

var Sophie = {
  runApp:Bootstrap.runApp,

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
  upgrade:Register.upgrade
}


window.Sophie = Sophie;
