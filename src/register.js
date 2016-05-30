
var utils = require("./utils");
var EE  = require("./event")
var element = require("./element");
var {dom,diff,vnode} = require("./deku")

var registry = {};

function register(inName, inOptions) {

    if(!inOptions){
      inOptions = inName;
      inName = "undefined"
    }

    var definition = inOptions || {};
    if (!inName) {
        throw new Error('Name argument must not be empty');
    }




    definition.name = inName;
    resolveTagName(definition);
    resolveMixin(definition);

    var createFun = function () {
      this.state = {}
      this.children = []
      this.refs = {}

    }


    var oldRender =  definition.render
    var oldComponentDidMount = definition.componentDidMount
    var oldComponentWillMount = definition.componentWillMount
    var componentDidInsert = definition.componentDidInsert
    var componentDidInsert = definition.componentDidInsert

    createFun.prototype = definition

    if(Sophie&&Sophie.renderRootElement){
      createFun.prototype.render = function(){
        return this.element(this.name, this.attributes, oldRender.apply(this, arguments))
      }
    }


    createFun.prototype.componentDidMount = function(){
     oldComponentDidMount&&oldComponentDidMount.apply(this, arguments)
       EE.trigger("componentDidMount",[this.node])
    }

    createFun.prototype.componentDidInserted = function(){
     oldComponentDidInserted&&oldComponentDidInserted.apply(this, arguments)
       EE.trigger("componentDidInsert",[this.node])
    }

    createFun.prototype.componentWillMount = function(){
      oldComponentWillMount&&oldComponentWillMount.apply(this, arguments)
       EE.trigger("oldComponentWillMount",[this.node])
    }

    //for decleare
    // createFun.prototype.getDefaultProps = function(){}
    // createFun.prototype.getInitialState = function(){}

    createFun.prototype.setState = function(value){

       this.state = value;
       this._update();

    }

    // //重置render方法，生成根元素
    // var oRender = definition.render;
    // createFun.prototype.render = function(){
    //   return element(this.name,this.props,oRender.apply(this,arguments));
    // }


    createFun.prototype._update = function(){

        var oldVnode = this.vnode;
        var newVnode = this.render();
        var changes = diff.diffNode(oldVnode, newVnode, vnode.createPath(this.path, oldVnode.key||"0"));
        this.vnode = newVnode;
        this.node = changes.reduce(dom.patch({}, this), this.node);

        return this.node;
    }


    createFun.prototype.element = function(){
      var vnode = element.apply(null, arguments)
      vnode.compontentContext = this.ovnode

      if(vnode.attributes&&vnode.attributes["ref"]){
        var refValue =  vnode.attributes["ref"];
        this.refs[refValue] = vnode;
      }

      return vnode
    },

    createFun.prototype.append =function(child){
          var children = this.children;
          child.parent = this
          child.compontentContext = this.compontentContext
          children.push(child);
          this._update()
          if(child.componentDidInsert){
            child.componentDidInsert();
          }
    }

    createFun.prototype.remove =function(child){
      var parent = this;
      var children = parent.children;
      for(var i=0; i<children.length;i++){
        if(children[i] == child){
        //  children[i].parent = undefined
          children.splice(i,1)

          break;
        }
      }
      this._update()
      if(child.componentDidRemove){
        child.componentDidRemove();
      }
    }

    createFun.prototype.insertBefore =function(target, before){
      var parent = this;
      var children = parent.children;
      for(var i=0; i<children.length;i++){
        if(children[i] == before){
          children.splice(i,0, target)
            target.compontentContext = this.compontentContext
          target.parent = parent
          break;
        }
      }
      this._update()
      if(target.componentDidInsert){
        target.componentDidInsert();
      }
    }

    createFun.prototype.insertAfter =function(target, after){
      var parent = this;
      var children = parent.children;
      for(var i=0; i<children.length;i++){
        if(children[i] == after){
          children.splice(i+1,0, target)
            target.parent = parent
              target.compontentContext = this.compontentContext
            break;
        }
      }
      this._update()
      if(target.componentDidInserted){
        target.componentDidInsert();
      }
    }



  if(inName!=="undefined"){
    registerDefinition(inName, createFun);
    document.createElement(inName);
  }

  createFun.prototype.constructor = createFun


  return createFun;
}

function resolveTagName(inDefinition) {
    inDefinition.tagName = inDefinition.name;
    inDefinition.type = inDefinition.name;
}


function resolveMixin(inDefinition) {
    var mixin= inDefinition.mixin||[];
    for(var i=0;i<mixin.length;i++){
        var pName = mixin[i];
      var pDefinition = registry[pName] || {};
      for (var p in pDefinition) {
          if (!inDefinition[p]) {
              inDefinition[p] = pDefinition[p];
          }
      }
    }
}

function registerDefinition(inName, inDefinition) {
    registry[inName] = inDefinition;
}



function walkRoot(root, callback) {
    var child = root.childNodes;
    for (var i = 0; i < child.length; i++) {

        var el = child[i];
        if (el.nodeType == 1) {
            var tagName = el.tagName.toLowerCase();
            var result = callback(el, tagName);
            if (result !== false) {
                walkRoot(child[i], callback);
            }
        }
    }
}



var getRegName = function (el) {

    var name = el.tagName.toLowerCase();
    var className = el.className;
    className = (" " + className + " ").replace(/[\n\t]/g, " ");

    for (var regName in registry) {

        var tn;
        var cn;
        var regNames = regName.split(".")

        if (regNames.length == 1) {
            tn = regNames[0];
            if (tn === name) {

                return tn;
            }

        }
        else if (regNames.length == 2) {
            tn = regNames[0];
            cn = regNames[1];

            if (tn && cn) {
                cn = " " + cn + " ";
                if (tn == name && className.indexOf(cn) > -1) {
                    return regName
                }
            }
            else if (cn) {
                if (className.indexOf(cn) > -1) {
                    return regName
                }
            }
        }


    }
}

function render(newVnode, inElement) {

  // attributes: attributes,
  // children: children,
  // type: type,
  // key: key

  var el = newVnode.render(newVnode);
 var domElement =   dom.createElement(el, null,null,newVnode);
  inElement.innerHTML="";
  inElement.appendChild(domElement);



}


function createVnodeFromDOMElement(el){

  //文本
  if(el.nodeType == 3){
    return {
      type: '#text',
      nodeValue: el.nodeValue,
      nativeNode:el
    }
  }
  //标签
  else if(el.nodeType == 1) {
    var type = el.tagName.toLowerCase();
    var attrs = el.attributes;
    var attributes = {}
    for(var i=0;i<attrs.length;i++){
      attributes[attrs[i].name]= attributes[attrs[i].value]

    }

    //@todo props
    return {
      type:type,
      attributes:attributes,
      nativeNode:el,
      children:[]
    }
  }

}


function implement(inElement, inDefinition) {
   var vnode = new inDefinition();
   vnode.nativeNode = inElement;
   return vnode;
}

function registerDOMProp(vnode, inElement){
  var attrs = inElement.attributes;
  var attributes = {}
  for(var i=0;i<attrs.length;i++){
    attributes[attrs[i].name]= attributes[attrs[i].value]

  }
  vnode.attributes = attributes;
}

function getDOMAttrs(inElement){
  var attrs = inElement.attributes;
  var attributes = {}
  for(var i=0;i<attrs.length;i++){
    attributes[attrs[i].name]= attributes[attrs[i].value]

  }

  return attributes
}



function upgrade(inElement) {

    if (!inElement.tagName)return;

    //如果已经更新过，就查看子元素是不是全部更新过
    if (inElement.__upgraded__) {

    }
    else {

      var name = inElement.tagName.toLowerCase();
      var inDefinition = registry[name];
      if (inDefinition) {
          EE.trigger("beforeCreate",[inElement])
          var vnode = implement(inElement, inDefinition);

          return vnode;
      }

    }
}


function readyUpgrage(vnode) {




  if ((0, dom.element.isThunk)(vnode)) {

    var component = vnode;


    //保留输出，setState，进行对比
    var  output = component.vnode;

    output.children.forEach(function (node, index) {
      if (node === null || node === undefined) {
        return;
      }
      var child = readyUpgrage(node);

    });

      EE.trigger("onCreate",[vnode.nativeNode])



  }


}


function readyUpgrage(inElement){
    inElement.__upgraded__ = true;
    EE.trigger("onCreate",[inElement])
}


function isLeaf(inElement){
    if(inElement){
        var name = inElement.tagName.toLowerCase();
        return registry[name];
    }
}


var isReady = false;

var upgradeDocument = function (doc) {
    var rootDOM = document.body;
    var rootVnode = createVnodeFromDOMElement(document.body);
    var appRoot;
    var func = function(el){
      var children = el.children;
      var vnode;
      var tagName = el.tagName.toLowerCase();

      if(isLeaf(el)){
        var inDefinition = registry[tagName];


         var vnodeChildren = []

         for(var i=0;i< children.length;i++){
           var child = children[i];
           var childVnode = func(child);
            vnodeChildren.push(childVnode)
         }

         vnode = element(inDefinition, getDOMAttrs(el), vnodeChildren);

         //根元素只能有一个
        appRoot = vnode;

         vnode.nativeNode = el;


      } else if(el.nodeType ==1){

        var vnodeChildren = []

        for(var i=0;i< children.length;i++){
          var child = children[i];
          var childVnode = func(child);
          vnodeChildren.push(childVnode)
        }

        vnode = element(tagName, getDOMAttrs(el), vnodeChildren);
        vnode.nativeNode = el;


      } else if(el.nodeType == 3){
        vnode = el.nodeValue
      }
      return vnode
    }


    func(rootDOM, rootVnode)


 if(appRoot){
   var rootId = "0"

    dom.createElement(appRoot,rootId,null,null)
    dom.mountElement(appRoot);
    readyUpgrage(appRoot)
 }



}

// utils.ready(function () {
//     isReady = true;
//     console.log("ready")
//     upgradeDocument();
// })


module.exports = {

  registry : registry,
  isLeaf : isLeaf,
  upgrade : upgrade,

  upgradeDocument : upgradeDocument,
  register : register
}
