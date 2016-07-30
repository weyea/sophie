
import {dom,diff,element,vnode} from "deku";
var currentOwner = require("./currentOwner");
var merge = require("merge");

module.exports =  function(type, attributes, ...children) {

  attributes = attributes||{};
  var key = typeof attributes.key === 'string' || typeof attributes.key === 'number' ? attributes.key : undefined;
  //id,自动生成Key
  if(!key){
    key = attributes.key = attributes.id;
  }

  var args = [];
  for(var i=0;i<arguments.length;i++){
  args.push(arguments[i]);
  }
  //class
  if(typeof type === 'function'){
    type = new type();
    if(type.render){
      var oldRender = type.render;
      type.render = function(){
        oldRender.apply(type,[])
      }
    }
    args[0] = type;
  }

  let result = element.apply(null,args);


  if(result.type=="thunk"&&result.options){
    result.options.compontentContext = result.options._owner = currentOwner.target;
    result.options.children = result.children;
    result.options.attributes=result.options.props = merge(result.options.props, result.props);

  }

  var children = result.children;
  for(var i = 0;i<children.length;i++){
    if(!children[i])continue;
    if(!children[i].parent){
        children[i].parent = result;
    }
  }

  if(attributes&&attributes["ref"]){
    var refValue =  vnode.attributes["ref"];
    if(currentOwner.target)currentOwner.target.refs[refValue] = vnode.options||vnode;
  }



  return result;
}
