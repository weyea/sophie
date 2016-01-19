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
	var MyButton = Leaf.register("my-button", {
	  name: "BaseDiv",
	  type: "span",
	  num: 0,

	  onCreate: function onCreate() {
	    var _this = this;

	    setInterval(function () {
	      _this.num++;
	      _this.setState({ name: [_this.num, 123] });
	    }, 1000);
	  },

	  render: function render() {

	    return Leaf.element(
	      "div",
	      { "class": "mybutton", "data-name": this.name },
	      this.children,
	      Leaf.element(
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

	var render = Leaf.dom.createRenderer(document.getElementById("deku"));
	render(Leaf.element(
	  MyButton,
	  null,
	  "hello world"
	), MyButton);

/***/ }
/******/ ]);