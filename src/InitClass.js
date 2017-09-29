var merge = require("merge");

export function initClass(props, children, owner) {
    if (owner) {
        this.owner = owner
        this.ownerDocument = owner
    }
    this.state = {}
    this.refs = {}
    this.props = this.attributes = merge({}, props || {})
    this.defaultProps = {}

    this.props.children = this.children = children;


    this.defaultProps = this.getDefaultProps()

    this.props = this.attributes = merge({}, this.defaultProps, this.props);


    if (!(children && children.length)) {

        var defaultChildren = this.getDefaultChildren();
        if(defaultChildren){
            if (Array.isArray(defaultChildren)) {
                this.props.children = this.children = defaultChildren;
            }
            else {
                this.props.children = this.children = [defaultChildren]
            }
        }


    }

    this.state = this.getInitialState() || {};


    this._constructor.apply(this, arguments)


}
