
import {dom,diff,element,vnode} from "../lib/deku/src/index";
var currentOwner = require("./currentOwner");
var merge = require("merge");

module.exports =  function(type, attributes, ...children) {



  attributes = attributes||{};
  var key = typeof attributes.key === 'string' || typeof attributes.key === 'number' ? attributes.key : undefined;
  //id,自动生成Key
  if(!key){
    key = attributes.key = attributes.id;
  }

  //class
  if(typeof type === 'function'){
    type = new type(attributes);
    if(type.render){
      var oldRender = type.render;
      type.render = function(){
       return  oldRender.apply(type,[])
      }
    }

  }

  var args = [type,attributes];
  if(children&&children.length){
    var newChildren = [];
    for(var i=0;i<children.length;i++){
      if(children[i]){
          newChildren.push(children[i]);
      }
    }
    args.push(newChildren)

  }

  let result = element.apply(null,args);
  result.creater = result.compontentContext = result._owner = currentOwner.target;


  if(result.type=="thunk"&&result.options){


    // type: 'thunk',
    // fn,
    // children,
    // props,
    // options,
    // key
    var options = result.options;
    options.type = result.type;
    options.fn = result.fn;
    options.key = result.key;
    options.children = result.children;
    options.attributes=options.props = merge(options.props, result.props);

    options.props.children = result.children;
    options.creater =options.owner =  options.compontentContext = options._owner = currentOwner.target;


    if(!options.props.children||options.props.children.length ==0){
      if(options.getDefaultChildren){
        options.props.children = options.getDefaultChildren();
      }
    }


    //保持deku的结构
    options.options = options;
    result = options;
  }



  var children = result.children;
  for(var i = 0;i<children.length;i++){
    if(!children[i])continue;

    //创建时的parent
    if(!children[i].parent){
        children[i].parent = result;
    }
  }



  if(attributes&&attributes["ref"]){
    var refValue = attributes["ref"];
    if(currentOwner.target)currentOwner.target.refs[refValue] = result;
  }

  return result;
}
