
var Div0 = Sophie.createClass("my-js-div-0",{
    getDefaultProps:function(){
        return {
            name:"div-0"
        }
    },
    componentDidMount:function(){

        console.log(this.props.name+" : "+ (this.props.num || 0))
    },
    render: function() {
        return (
            <div   class="div-0">
                {this.props.name+" : "+ (this.props.num || 0)}
            </div>
        )
    }
})
var Div1 = Sophie.createClass("my-js-div-1",{
    getDefaultProps:function(){
      return {
          name:"div-1"
      }
    },
    componentDidMount:function(){

        console.log(this.props.name+" : "+ (this.props.num || 0))
    },
    render: function() {
        return (
            <div   class="div-1">
                {this.props.name+" : "+ (this.props.num || 0)}
            </div>
        )
    }
})


var Div2 = Sophie.createClass("my-js-div-2",{

    getDefaultProps:function(){
        return {
            name:"div-2"
        }
    },
    componentDidMount:function(){

        console.log(this.props.name+" : "+ (this.props.num || 0))
    },

    render: function  () {
        return (
            <div  class="div-2">
                {this.props.name+" : "+ (this.props.num || 0)}
            </div>
        )
    }
})


var Div3 = Sophie.createClass("my-js-div-3",{
    getDefaultProps:function(){
        return {
            name:"div-3"
        }
    },
    componentDidMount:function(){

        console.log(this.props.name+" : "+ (this.props.num || 0))
    },
    render: function  () {
        return (
            <div class="div-3">
                {this.props.name+" : "+ (this.props.num || 0)}
            </div>
        )
    }
})

var Div4 = Sophie.createClass("my-js-div-4",{
    getDefaultProps:function(){
        return {
            name:"div-4"
        }
    },
    componentDidMount:function(){

      console.log(this.props.name+" : "+ (this.props.num || 0))
    },
    render: function  () {
        return (
            <div  class="div-4">
                {this.props.name+" : "+ (this.props.num || 0)}
            </div>
        )
    }
})









var MyJSDiv = Sophie.createClass("my-js-div",{

      componentWillMount:function(){

      },
      getInitialState:function(){
        return {
            num:2
        }
      },

        getDefaultChildren:function(){
          return [
              <Div0  num="0"/>,
              <Div1 num="1"/>,
              <Div2 num="2"/>,
              <Div3 id="3" num="3"/>,
              <Div4 num="4"/>,
              <Div3 num="5"/>,

          ]
        },
      componentDidMount:function(){

        setTimeout(()=>{
          this.setState({num:++this.state.num})
        },3000)
      },

      render: function  () {

          if(this.state.num%2 == 0){
           return   <div class="container">
               {this.props.children}
              </div>
          }
          else{

           return    <div class="container">

                          <div class="grid">
                              {this.props.children[4]}
                              {this.props.children[5]}
                          </div>
                        {this.props.children[1]}
               <Div4 num ="6"></Div4>
                       <div class="grid">
                           {this.props.children[0]}
                           {this.props.children[3]}
                       </div>
                        {this.props.children[2]}

              </div>
          }

      }

    })

Sophie.createStyleSheet({
    ".grid":{
        marginLeft:10}
})



 Sophie.runApp(MyJSDiv)

