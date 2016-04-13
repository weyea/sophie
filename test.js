/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	//
	//
	//

	Sophie.createStyleSheet({
	  "my-button": {
	    border: "solid 1px red",
	    display: "block"
	  }
	});

	var WhatIWantToSay = "header";

	var MyDivHeader = Sophie.createClass("my-div-header", {

	  componentWillMount: function componentWillMount() {},

	  componentDidMount: function componentDidMount() {
	    console.log("header");
	  },

	  render: function render() {
	    return this.element(
	      "div",
	      null,
	      "header"
	    );
	  }

	});

	var MyDivBody = Sophie.createClass("my-div-body", {

	  componentWillMount: function componentWillMount() {},

	  componentDidMount: function componentDidMount() {
	    console.log("body");
	  },

	  render: function render() {
	    return this.element(
	      "div",
	      null,
	      "body"
	    );
	  }

	});

	var MyHTMLDiv = Sophie.createClass("my-div", {
	  name: "BaseDiv",
	  type: "span",
	  num: 0,

	  componentWillMount: function componentWillMount() {
	    this.state.name = 123;
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    this.setState({ name: 123 });
	    console.log("gogog");

	    setInterval(function () {
	      _this.num++;
	      _this.setState({ name: [_this.num, 123] });
	    }, 1000);
	  },

	  render: function render() {

	    return this.children;
	  }

	});

	var BaseDiv = Sophie.createClass("base-div", {

	  render: function render(_ref) {
	    var props = _ref.props;
	    var children = _ref.children;
	    var context = _ref.context;
	    var path = _ref.path;

	    return this.element(
	      "div",
	      { "class": "baseDiv", "data-name": this.name },
	      children
	    );
	  }
	});

	var MyJSDiv = Sophie.createClass("my-js-div", {

	  componentWillMount: function componentWillMount() {
	    this.state.name = 123;
	  },
	  componentDidMount: function componentDidMount() {
	    var _this2 = this;

	    this.setState({ name: 123 });
	    console.log("gogog");

	    setInterval(function () {
	      _this2.num++;
	      _this2.setState({ name: [_this2.num, 123] });
	    }, 1000);
	  },

	  render: function render() {
	    return this.element(
	      "div",
	      { "class": "container" },
	      this.element(
	        "div",
	        null,
	        this.element(
	          BaseDiv,
	          { "class": "my-button" },
	          "basediv"
	        )
	      )
	    );
	  }

	});

	// console.log(Sophie.renderElement(MyJSDiv))

	Sophie.runApp(MyJSDiv);

/***/ }
/******/ ]);