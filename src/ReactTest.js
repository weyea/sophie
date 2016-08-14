var React  =require("react");
var ReactDOM = require("react-dom");


var target;
var getReactComponent = function(e){
  for(var p in e){
    if(/^__reactInternalInstance/.test(p)){
      return e[p];
    }
  }
}
var Child1 =  React.createClass({
  componentDidMount:function(){
    setTimeout(()=>{

        this.forceUpdate();


    },4000)
  },
  render: function() {
    if(target){
        return <div>Hello1{target}</div>;
    }
    else{
        return <div>Hello1</div>;
    }

  }
});

var Child2 =  React.createClass({
  getInitialState:function(){
    return {num:1}
  },
  componentWillUnmount:function(){

    clearInterval(this.time)
    console.log("child2 componentWillUnmount")
  },
  componentDidMount:function(){
    console.log("child2 componentDidMount")
    this.time =   setInterval(() =>{
      
          this.setState({num:++this.state.num})

      },500)
  },
  render: function() {
    return <div id="child2">Hello{this.state.num}</div>;
  }
});

var Root =  React.createClass({
  componentWillMount:function(){
    this.children = this.props.children;
      console.log(  this.children)
  },
  componentDidMount:function(){


        // var node = document.getElementById("child2");
        // var com = getReactComponent(node)


      var oldChild = this.props.children;
      var f = oldChild[0];
      var s = oldChild[1];
      target = s;
      // setTimeout(()=>{
      //   this.children = [s]
      //   this.forceUpdate();
      // },2000)
      //
      //
      // setTimeout(()=>{
      //
      //
      //     this.children = []
      //     this.forceUpdate();
      //
      //     this.children = [s];
      //     this.forceUpdate();
      //
      //
      // },4000)
  },
  render: function() {
    return  <div className="root">
      {this.children}
    </div>;
  }
});

var HelloMessage = React.createClass({
  componentDidMount:function(){
      console.log(this)
  },
  render: function() {
    return <Root>
        <Child1 key="1"></Child1>
        <Child2 key="2"></Child2>
    </Root>
  }
});

ReactDOM.render(
  <HelloMessage name="John" />,
  document.getElementById("deku")
);
