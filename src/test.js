//
//
//

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



var MyDiv = Sophie.createClass("my-div",{
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


// <div ref="div" class="mybutton" data-name={this.name}>
//   <ShowDiv></ShowDiv>
// </div>

// var BaseDiv = {
//     name:"BaseDiv",
//
//     onCreate:function(){
//     },
//     render: function  ({ props, children, context, path }) {
//
//
//       return (
//         <div class="baseDiv" data-name={this.name}>
//             {children}
//         </div>
//       )
//     }
//
//   }
  //
  // var MyButton = {
  //
  //     onCreate:function(){
  //     },
  //     render: function  ({ props, children, context, path }) {
  //
  //
  //       return (
  //         <div class="container">
  //             <div>
  //               <BaseDiv class="my-button">basediv</BaseDiv>
  //             </div>
  //
  //         </div>
  //
  //       )
  //     }
  //
  //   }
  //
  //
  //
  //

  Sophie.createStyleSheet({
    "my-button":{
      border:"solid 1px red",
      display:"block"
    }
  })



 // Sophie.runApp(MyDiv)
