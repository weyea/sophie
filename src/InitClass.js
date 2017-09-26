var merge = require("merge");

export function initClass (SohpieConstructor, superConstructor,props, children, owner) {


    var _self = SohpieConstructor.prototype;



    var defaultProps = _self.getDefaultProps && _self.getDefaultProps.apply(this,[]);
    var newProps = merge({},this.props || {}, defaultProps || {}, this.props || {}, props || {})
    this.props = this.attributes = newProps;

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


    var defaultState = _self.getInitialState && _self.getInitialState.apply(this,[]);
    var newState = merge({},this.state || {}, defaultState || {}, this.state || {})
    this.state = newState
    _self._constructor.apply(this, arguments)
}
