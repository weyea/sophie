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

	var WhatIWantToSay = "I LOVE YOU! SHENG YUAN YUAN";

	var ShowDiv = Sophie.createClass("my-l-div", {

	  componentWillMount: function componentWillMount() {
	    this.state.name = 123;
	  },

	  componentDidMount: function componentDidMount() {
	    console.log("123");
	  },

	  render: function render() {
	    return Sophie.element(
	      "div",
	      null,
	      WhatIWantToSay
	    );
	  }

	});

	var MyButton = Sophie.createClass("my-div", {
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

	    return Sophie.element(
	      "div",
	      { ref: "div", "class": "mybutton", "data-name": this.name },
	      Sophie.element(ShowDiv, null)
	    );
	  }

	});

	// var BaseDiv = {
	//     name:"BaseDiv",
	//
	//     onCreate:function(){
	//     },
	//     render: function  ({ props, children, context, path }) {
	//
	//
	//       return (
	//         <div class="baseDiv" data-name={this.name}>
	//             {children}
	//         </div>
	//       )
	//     }
	//
	//   }
	//
	// var MyButton = {
	//
	//     onCreate:function(){
	//     },
	//     render: function  ({ props, children, context, path }) {
	//
	//
	//       return (
	//         <div class="container">
	//             <div>
	//               <BaseDiv class="my-button">basediv</BaseDiv>
	//             </div>
	//
	//         </div>
	//
	//       )
	//     }
	//
	//   }
	//
	//
	//
	//

	Sophie.createStyleSheet({
	  "my-button": {
	    border: "solid 1px red",
	    display: "block"
	  }
	});

	Sophie.runApp(MyButton);

/***/ }
/******/ ]);