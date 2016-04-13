//bootstrap

  var {dom} = require("./deku")
  var utils = require("./utils")
  var Register = require("./register")
  var Element = require("./element");
  var EE  = require("./event")
  var StyleSheet = require("./styleSheet")


  var renderDocument = function () {
          Register.upgradeDocument(document);
  }

  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.innerText = "body{opacity:0;filter:alpha(opacity=0)}";





  module.exports = {
    runApp: function(compontent, container,fire){
      utils.ready(function () {
          var  container = container?container:document.body
          let render = dom.createRenderer(document.body)
          var vnode = Element(compontent,{},null);
          render(vnode, container)
          if(fire !== false)  EE.trigger("ready",[vnode])
        })

    },

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
