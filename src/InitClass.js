var merge = require("merge");

export function initClass (SohpieConstructor, superConstructor,props, children, owner) {

    var _self = SohpieConstructor.prototype;




    if(_self.getDefaultProps){
        var changeProps = {}
        for(var  p in this.defaultProps){
            if(this.props[p] !== this.defaultProps[p]){
                changeProps[p] =  this.props[p];
            }

        }
        var defaultProps = _self.getDefaultProps && _self.getDefaultProps.apply(this,[]);
        this.defaultProps = merge({},this.defaultProps || {}, defaultProps||{})
        this.props = this.attributes = merge({},  this.defaultProps , changeProps);
    }




    var newChildren = []
    if(children&&children.length){
        for(var i = 0;i < children.length;i++){
            newChildren.push(children[i])
        }
    }

    this.children =this.props.children = newChildren

    if (!(children&&children.length)) {
        if (_self.getDefaultChildren) {
            var defaultChildren = _self.getDefaultChildren.apply(this,[]);
            if (Array.isArray(defaultChildren)) {
                this.props.children = defaultChildren;
            }
            else {
                this.props.children = [defaultChildren]
            }
        }
    }




    if(_self.getInitialState){
        var changeStates = {}
        for(var  p in this.defaultStates){
            if(this.state[p] !== this.defaultStates[p]){
                changeStates[p] =  this.state[p];
            }
        }

        var defaultState =  _self.getInitialState.apply(this,[]);
        var newState = merge({},this.defaultStates || {}, defaultState || {})
        this.defaultStates = newState

        this.state =  merge({}, this.defaultStates,changeStates);

    }

    if(_self._constructor){
        _self._constructor.apply(this, arguments)
    }


}
