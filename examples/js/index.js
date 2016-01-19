
var {element, dom, diff}  = require("deku")


var Leaf = {}


Leaf.element =  function(type, attributes, children) {
  let vnode = element(type, attributes, children)
  return vnode
}


var BaseDiv = {
  name:"BaseDiv",
  type:"span",

  onCreate:function(){
  },
  render: function  ({ props, children, context, path }) {


    return (
      <div class="baseDiv" data-name={this.name}>
          {children}
      </div>
    )
  }
}

// Define a state-less component
var MyButton = {
  name:"mybutton",

  title:"hello world",
  onCreate:function(){
    console.log("oncreate",this)
  },
  render: function  ({ props, children, context, path }) {
      console.log("MyButton",context,this)

    return (
      <div class="MyButton">
        <div>{this.title}</div>
      </div>
    )
    }
}


let render = dom.createRenderer(document.body)



render(
  <MyButton></MyButton>,
  MyButton
)
MyButton.title="hello "

debugger;

render(
  <MyButton></MyButton>,
  MyButton
)
