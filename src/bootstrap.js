//bootstrap

  import {createElement} from "./create";
  import {dom,diff,element,vnode,createApp} from "deku";
  var utils = require("./utils")
  var Register = require("./register")
  var Element = require("./element");
  var EE  = require("./event")
  var StyleSheet = require("./styleSheet")



  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.innerText = "body{opacity:0;filter:alpha(opacity=0)}";


  var isReady = false
  var callbacks = []
  var ready = function(callback){
     if(isReady){
       callback&&callback()
     }
     else{
       callbacks.push(callback)
     }
  }

 var fireReady = function(){
   if(!isReady) return;
   for(var i=0;i<callbacks.length;i++){
     callbacks[i]&&callbacks[i]();
   }
 }

  module.exports = {
    runApp: function(compontent, container,fire){
      // utils.ready(function () {
          var  container = container?container:document.body
          let render = createApp(container)
          var vnode = Element(compontent,{},null);
          Sophie.firstVnode = vnode
          render(vnode);
          isReady = true;
          if(fire !== false)  {
            EE.trigger("ready",[vnode])
            fireReady();
          }
      // })

    },

    ready:ready,

    createVnodeByTagName:function(name){
        var compontent = Register.registry[name]
        var vnode = Element(compontent,{},null);
        return vnode;
    },

    createElementByVnode:function(vnode){

        return   dom.createElement(vnode,0)
    },

    createElementByTagName:function(name){

        var vnode = this.createVnodeByTagName(name)

        return   this.createElementByVnode(vnode)
    }

  }
