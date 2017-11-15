var merge = require("merge");

var utils = require("./utils")

export function initClass(props, children, owner) {
    if (owner) {
        this.owner = owner
        this.ownerDocument = owner
    }

    //for history
    if (props.__state) {
        this.state = props.__state
        delete props.__state
    }
    else {
        this.state = {}
    }


    this.refs = {}
    this.props = this.attributes = utils.extend(true, {}, props || {})
    this.defaultProps = {}

    this.props.children = this.children = utils.extend([], children)


    this.defaultProps = this.getDefaultProps()

    this.props = this.attributes = utils.extend(true, {}, this.defaultProps, this.props);


    if (!(children && children.length)) {

        var defaultChildren = this.getDefaultChildren();
        if (defaultChildren) {
            if (Array.isArray(defaultChildren)) {
                this.props.children = this.children = defaultChildren;
            }
            else {
                this.props.children = this.children = [defaultChildren]
            }
        }


    }

    this.state = utils.extend(true, {}, this.getInitialState() || {}, this.state);


    this._constructor.apply(this, arguments)


}
