var Div1 = Sophie.createClass("my-js-div-1",{
    getDefaultProps:function(){
      return {
          id:"div-1"
      }
    },
    render: function() {
        return (
            <div  id={this.props.id} class="div-1">
               div-1
            </div>
        )
    }
})


var Div2 = Sophie.createClass("my-js-div-2",{
    getDefaultProps:function(){
        return {
            id:"div-2"
        }
    },
    render: function  () {
        return (
            <div id={this.props.id} class="div-2">
                div-2
            </div>
        )
    }
})


var Div3 = Sophie.createClass("my-js-div-3",{
    getDefaultProps:function(){

        return {
            id:"div-3"
        }
    },
    render: function  () {
        return (
            <div id={this.props.id} class="div-3">
                div-3
            </div>
        )
    }
})








var MyJSDiv = Sophie.createClass("my-js-div",{


      componentWillMount:function(){

        this.num = 0;
      },
      componentDidMount:function(){
        var num = 0;


        setInterval(()=>{

          this.setState({num:num++})

        },1000)
      },

      render: function  () {
            console.log(this.state.num)
          if(this.state.num%2 == 0){
           return   <div class="container">
                  <Div1/>
                  <Div2/>
                  <Div3/>
              </div>
          }
          else{

           return    <div class="container">
                  <div>
                      <Div1/>
                      <Div2/>
                  </div>
                  <Div3/>

              </div>
          }

      }

    })





 Sophie.runApp(MyJSDiv)

