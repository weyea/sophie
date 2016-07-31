
  Sophie.createStyleSheet({
    "my-button":{
      border:"solid 1px red",
      display:"block"
    }
  })


var WhatIWantToSay = "header"

var  MyDivHeader = Sophie.createClass("my-div-header", {

  componentWillMount:function(){


  },

  componentDidMount:function(){
    console.log("header")
  },

  render:function(){
    return (<div>header</div>)
  }

})


var  MyDivBody = Sophie.createClass("my-div-body", {

  componentWillMount:function(){


  },

  componentDidMount:function(){
    console.log("body")
  },

  render:function(){
    return (<div>body</div>)
  }

})



var MyHTMLDiv = Sophie.createClass("my-div",{
  name:"BaseDiv",
  type:"span",
  num:0,

  componentWillMount:function(){
    this.state.name=123
  },
  componentDidMount:function(){

    this.setState({name:123})
    console.log("gogog")

    setInterval(()=>{
      this.num++;
    this.setState({name:[this.num,123]})

    },1000)
  },

  render: function  () {

    return (
       this.children
    )
  }

})



  var BaseDiv = Sophie.createClass("base-div",{


    render: function() {

      return (
        <div class="baseDiv" data-name={this.name}>
            {this.props.children}
        </div>
      )
    }
  })




    var MyJSDiv = Sophie.createClass("my-js-div",{


      componentWillMount:function(){

        this.num = 0;
      },
      componentDidMount:function(){

          console.log(this.refs["baseDiv"])

        setInterval(()=>{
          this.num++;
          this.setState({name:this.num})

        },1000)
      },

      render: function  () {
        return (
          <div class="container">
              <div class="123">
                <BaseDiv ref="baseDiv">basediv{this.state.name}</BaseDiv>
              </div>

          </div>

        )
      }

    })



	// console.log(Sophie.renderElement(MyJSDiv))
Sophie.on("ready", function(){
  console.log("ready");
})

 Sophie.runApp(MyJSDiv)
