//bootstrap

  var {dom} = require("./deku")
  var utils = require("./utils")
  var Register = require("./register")
  var Element = require("./element");
  var EE  = require("./event")
  var StyleSheet = require("./StyleSheet")




  var renderDocument = function () {
          Register.upgradeDocument(document);
  }

  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.innerText = "body{opacity:0;filter:alpha(opacity=0)}";
  utils.ready(function () {


       head.appendChild(style);



      try {
          renderDocument(document);
      } catch (e) {
          throw e;
      } finally {
          head.removeChild(style);
          StyleSheet.create({
            content:{
              display:'block'
            }
          })
          EE.trigger("ready")
      }

  })

  module.exports = {
    runApp: function(compontent, container){
      EE.on("ready", function(){
        var  container = container?container:document.body
        let render = dom.createRenderer(document.body)
        var vnode = Element(compontent,{},null);
        render(vnode, container)
      })

    }
  }
