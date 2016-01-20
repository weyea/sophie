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

	var MyButton = Sophie.createClass("my-button", {
	  name: "BaseDiv",
	  type: "span",
	  num: 0,

	  componentWillMount: function componentWillMount() {
	    var _this = this;

	    this.state.name = 123;
	    setInterval(function () {
	      _this.num++;
	      _this.setState({ name: [_this.num, 123] });
	    }, 1000);
	  },
	  componentDidMount: function componentDidMount() {
	    console.log(this.refs.div);
	  },

	  render: function render() {

	    return Sophie.element(
	      "div",
	      { ref: "div", "class": "mybutton", "data-name": this.name },
	      this.children,
	      Sophie.element(
	        "span",
	        null,
	        this.state.name
	      )
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

	//   var MyButton = {
	//
	//       onCreate:function(){
	//       },
	//       render: function  ({ props, children, context, path }) {
	//
	//
	//         return (
	//           <div class="container">
	//               <div>
	//                 <BaseDiv class="my-button">basediv</BaseDiv>
	//               </div>
	//
	//           </div>
	//
	//         )
	//       }
	//
	//     }
	//
	//
	//
	//
	//

	Sophie.runApp(MyButton);

/***/ }
/******/ ]);