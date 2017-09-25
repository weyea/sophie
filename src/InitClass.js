var merge = require("merge");

export function initClass (SohpieConstructor, superConstructor,props, children, owner) {


    var _self = SohpieConstructor.prototype;
    if (superConstructor) {
        this.super = superConstructor
    }


    var defaultProps = _self.getDefaultProps && _self.getDefaultProps();
    var newProps = merge(this.props || {}, defaultProps || {}, this.props || {}, props || {})
    this.props = this.attributes = newProps;

    if (!(children&&children.length)) {
        if (_self.getDefaultChildren) {
            var defaultChildren = _self.getDefaultChildren();
            if (Array.isArray(defaultChildren)) {
                this.props.children = defaultChildren;
            }
            else {
                this.props.children = [defaultChildren]
            }
        }
    }


    var defaultState = _self.getInitialState && _self.getInitialState()
    var newState = merge(this.state || {}, defaultState || {}, this.state || {})
    this.state = newState
    SohpieConstructor.prototype._constructor.apply(this, arguments)
}
