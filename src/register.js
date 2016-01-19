
var utils = require("./utils");
var EE  = require("./event")
var {dom,diff,element,vnode} = require("./deku")

var registry = {};

function register(inName, inOptions) {
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

    }

    createFun.prototype = definition

    createFun.prototype.setState = function(value){
       this.state = value;
       this._update();

    }

    createFun.prototype._update = function(){
        var oldVnode = this.vnode;
        var newVnode = this.render();

        var changes = diff.diffNode(oldVnode, newVnode, vnode.createPath(this.path, oldVnode.key||"0"));

        this.node = changes.reduce(dom.patch({}, this), this.node);
        this.vnode = newVnode;
        return this.node;
    }



    registerDefinition(inName, createFun);

    document.createElement(inName);

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

function isInTemplate(el) {
    var p;
    while (p = el.parentNode) {
        if (p.tagName && p.tagName.toLowerCase() == "template") {
            return true;
        }
        el = p;
    }
}

function walk(name, context, callback) {
    var define = registry[name];
    var tagName = define["extents"] || name;
    context = context || document;
    var els = context.getElementsByTagName(tagName);
    for (var i = 0; i < els.length; i++) {
        if (!isInTemplate(els[i])) {
            callback(els[i]);
        }
    }
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


var upgrageCallbacks = [];
var onUpgrade = function (callback) {
    upgrageCallbacks.push(callback);
}

var beforeUpgrageCallbacks = [];
var onBeforeUpgrade = function (callback) {
    beforeUpgrageCallbacks.push(callback);
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

function createVnodeFromDOMElement(el){
   var type = el.tagName.toLowerCase();

   //@todo props
   return {
     type:type,
     nativeNode:el
   }

}


function upgrade(inElement) {

    if (!inElement.tagName)return;

    if (inElement.__upgraded__) {
        walkRoot(inElement, function (el, tagName) {
            var regName = getRegName(el);
            if (regName) {
                upgrade(el);
                return false;
            }
            return true;
        })

        return;

    }
    else {

      var name = inElement.tagName.toLowerCase();
      var is = inElement.getAttribute("is");
      var regName = getRegName(inElement)
      if (regName) {
          var inDefinition = registry[regName];
          if (inDefinition) {
              var vnode = implement(inElement, inDefinition);

              walkRoot(inElement, function (el, tagName) {
                  var regName = getRegName(el);
                  if (regName) {
                      upgrade(el);
                      return false;
                  }
                  return true;
              })

              var newVnode = implement(inElement, inDefinition);



              registerDOMProp(newVnode, inElement)


              inElement.__upgraded__ = true;


              EE.trigger("beforeCreate",[inElement])

              ready(vnode,newVnode,inElement);

              EE.trigger("onCreate",[inElement])

          }
      }
      else {


      }


      return inElement;

    }





}


//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Internet_Explorer_8_specific_notes

function implement(inElement, inDefinition) {
   var vnode = new inDefinition();
   vnode.nativeNode = inElement;
   return vnode;
}

function registerDOMProp(vnode, inElement){
   var children = []
   var childNodes = inElement.childNodes;

   for(var i=0;i<childNodes.length;i++){
     children.push(createVnodeFromDOMElement(childNodes[i]));
   }
   vnode.children = children;
}


function isLeaf(inElement){
    if(inElement){
        var name = inElement.tagName.toLowerCase();
        return registry[name];
    }
}


var initialize = function () {
    for (var p  in registry) {
        walk(p, document, function (element) {
            upgrade(element);
        });
    }
}

function ready(oldVnode, newVnode, inElement) {

  // attributes: attributes,
  // children: children,
  // type: type,
  // key: key

  var el = newVnode.render(newVnode);
 var domElement =   dom.createElement(el);
  inElement.innerHTML="";
  inElement.appendChild(domElement);



};



var isReady = false
utils.ready(function () {
    isReady = true;
    initialize();
})


module.exports = {
  onUpgrade:onUpgrade,
  registry : registry,
  isLeaf : isLeaf,
  upgrade : upgrade,
  onBeforeUpgrade,
  upgradeDocument : function (doc) {
      walkRoot(doc.body || doc, function (el, tagName) {
          if (getRegName(el)) {
              upgrade(el);
              return false;
          }
      })

  },



  register : register
}
