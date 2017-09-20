import {dom, diff, element, vnode} from "../lib/deku/src/index";

var currentOwner = require("./currentOwner");
var merge = require("merge");

module.exports = function (type, attributes, ...children) {


    attributes = attributes || {};
    var key = typeof attributes.key === 'string' || typeof attributes.key === 'number' ? attributes.key : undefined;
    //id,自动生成Key
    if (!key) {
        key = attributes.key = attributes.id;
    }

    let result;
    var newChildren = [];
    if (children && children.length) {

        for (var i = 0; i < children.length; i++) {
            if (typeof children[i] == "string" && children[i].trim() == "") {
                continue;
            }

            if (children[i]) {
                newChildren.push(children[i]);
            }
        }


    }

    if (typeof type === 'function' && type.prototype.render) {
       result = new type(attributes, newChildren, currentOwner.target);
       result.type ="thunk"

    }
    //用方法 返回 属性 来 创建 element
    else if (typeof type === 'function') {
        var typeObject = type(attributes, currentOwner.target)
        type = typeObject.type
        var attrs = typeObject.attributes || {}
        for (var p in attrs) {
            attributes[p] = attrs[p];
        }

        result = element.apply(null, [type, attributes, newChildren]);

    }
    else{
        result = element.apply(null, [type, attributes, newChildren]);
    }

    result.ownerDocument = result.creater = result.compontentContext = result.owner = result._owner = currentOwner.target;

    var children = result.props.children;
    for (var i = 0; i < children.length; i++) {
        if (!children[i]) continue;

        //创建时的parent
        if (!children[i].parent) {
            children[i].parent = result;
        }
    }

    if (attributes && attributes["ref"]) {
        var refValue = attributes["ref"];
        if (currentOwner.target) currentOwner.target.refs[refValue] = result;
    }

    return result;
}
