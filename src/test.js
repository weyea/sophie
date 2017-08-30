


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
                <svg class="grid-lines"><line x1="150" y1="0" x2="150" y2="100%" class="backLine"></line><line x1="1130" y1="0" x2="1130" y2="100%" class="backLine"></line><line x1="0" y1="128" x2="100%" y2="128" class="backLine"></line><line x1="0" y1="5817" x2="100%" y2="5817" class="backLine"></line><line x1="150" y1="0" x2="150" y2="100%" class="frontLine"></line><line x1="1130" y1="0" x2="1130" y2="100%" class="frontLine"></line><line x1="0" y1="128" x2="100%" y2="128" class="frontLine"> </line><line x1="0" y1="5817" x2="100%" y2="5817" class="frontLine"></line></svg>
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

