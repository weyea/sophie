//
//
//

Sophie.createStyleSheet({
  "my-button":{
    border:"solid 1px red",
    display:"block"
  }
})

var MyButton = Sophie.createClass("my-div",{
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
      <div ref="div" class="mybutton" data-name={this.name}>
          {this.children}
          <span>{this.state.name}</span>
      </div>
    )
  }

})


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

//   var MyButton = {
//
//       onCreate:function(){
//       },
//       render: function  ({ props, children, context, path }) {
//
//
//         return (
//           <div class="container">
//               <div>
//                 <BaseDiv class="my-button">basediv</BaseDiv>
//               </div>
//
//           </div>
//
//         )
//       }
//
//     }
//
//
//
//
//

 // Sophie.runApp(MyButton)
