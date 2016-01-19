

var Register = require("./register")
var Element = require("./element")
var Import = require("./import")
var StyleSheet = require("./styleSheet")
var Compontent = require("./compontent.js");
var Bootstrap = require("./bootstrap")

var Sophie = {
  runApp:Bootstrap.runApp,
  element : Element,
  register:Register.register,
  createClass:Compontent,
  import:Import,
  createStyleSheet:StyleSheet.create,
  StyleSheet:StyleSheet
}


window.Sophie = Sophie;
