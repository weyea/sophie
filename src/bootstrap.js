//bootstrap


  import {dom,diff,element,vnode,createApp}  from "../lib/deku/src/index";
  var utils = require("./utils")
  var Register = require("./register")
  var Element = require("./element");
  var EE  = require("./event")
  var StyleSheet = require("./styleSheet");
  var mount = require("./mount");

  var currentOwner = require("./currentOwner");



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
          mount(vnode);
          if(!isReady){
            isReady = true;
            if(fire !== false)  {
              EE.trigger("ready",[vnode])
              fireReady();
            }
          }

      // })

    },

    ready:ready,
    renderToJSON:function(){
        // app
      var outVnode = Sophie.firstVnode.rootVnode;
      var walk = function(vnode){

         var currentData = {};
         var children= vnode.children;

        if(Sophie.isThunk(vnode)){
          var component = vnode
          children = vnode.children

          currentData.type="thunk"
          // currentData.state = component.state
          var attributes = {};
          for(var p in component.attributes){
            if(p == "children")continue;
            attributes[p] = component.attributes[p];
          }
          currentData.attributes = attributes
          currentData.name = component.name
        }
        else if(vnode.type=="text"){
          currentData.type =  vnode.type
          currentData.nodeValue = vnode.nodeValue

        }
        else if(vnode.type =="native"){
          currentData.type = "native"
          currentData.tagName =  vnode.tagName;
          var attributes = {};
          for(var p in vnode.attributes){
            if(p == "children")continue;
            attributes[p] = vnode.attributes[p];
          }
          currentData.attributes = attributes

        }
        currentData.children = [];
        if(children&&children.length){
          for(var i=0;i<children.length;i++){
              if(children[i])currentData.children.push(walk(children[i]))
          }
        }
        return  currentData;
      }

      var data =   walk(outVnode);
      return data

    },
    renderFromJSON :function(data,container,callback){
      var htmlData = data;
      if(htmlData){
        var site = htmlData;
        var APP = Sophie.createClass("app", {
          render:function(){
            var self = this;
            var func = function(children){
              var result = []
              for(var i=0;i<children.length;i++){
                 var c = children[i];
                 if(c.type=="thunk"){
                   result.push(self.element(Sophie.registry[c.name],c.attributes,func(c.children)))
                 }
                 else if(c.type=="text"){

                  result.push({
                      type: 'text',
                      nodeValue: c.nodeValue
                    })
                 }
                 else if(c.type = "native"){
                   result.push(self.element(c.tagName,c.attributes,func(c.children)))
                 }
              }

              return result;
            }
            return  this.element("app",{},func(site.children))

          }

        })

        Sophie.runApp(APP,container||$("#dotlinkface").get(0),true)
      }

      setTimeout(function () {
          callback&&callback()
      }, 0)

    },
    //第个组件生成元素
    isBaseVnode:function(vnode){
        return vnode._owner&&vnode._owner.name == Sophie.firstVnode.name
    },

    getOwner:function(vnode){
      if(Sophie.isThunk(vnode)){
        return vnode;
      }else {
        return vnode._owner;
      }
    },

    getParent:function(vnode){
        return vnode.parent;
    },
    closestBaseParent:function(vnode){
      if(this.isBaseVnode(vnode)){
        return vnode;
      }
      else {
        var owner = this.getOwner(vnode);
        return this.closestBaseParent(owner);

      }

    },
    getBaseParent:function(vnode){
      var parent = this.getParent(vnode);
      if(this.isBaseVnode(parent)){
        return parent;
      }
      else {
        var owner = this.getOwner(parent);
        return this.closestBaseParent(owner);

      }
    },


    createVnodeByTagName:function(name){
        var compontent = Register.registry[name];
        if(!compontent)throw new Error("name 没有注册");

        currentOwner.target =  Sophie.firstVnode

        var vnode = Element(compontent,{},null);
          currentOwner.target =  undefined;
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
