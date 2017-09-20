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

    var args = [type, attributes];
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
        args.push(newChildren)

    }

    if (typeof type === 'function' && type.prototype.render) {
        type = new type(attributes, newChildren, currentOwner.target);
        if (type.render) {
            var oldRender = type.render;
            type.render = function () {
                return oldRender.apply(type, [])
            }
        }
    }
    //typey
    else if (typeof type === 'function') {
        var typeObject = type(attributes, currentOwner.target)
        type = typeObject.type
        var attrs = typeObject.attributes || {}
        for (var p in attrs) {
            attributes[p] = attrs[p];
        }

    }


    let result = element.apply(null, args);
    result.creater = result.compontentContext = result.owner = result._owner = currentOwner.target;


    if (result.type == "thunk" && result.options) {
        // type: 'thunk',
        // fn,
        // children,
        // props,
        // options,
        // key
        var options = result.options;
        options.type = result.type;
        options.fn = result.fn;
        options.key = options.id = (result.key || result.id);
        options.children = result.children;
        options.attributes = options.props = merge(options.props, result.props);

        options.props.children = result.children;
        options.creater = options.owner = options.compontentContext = options._owner = currentOwner.target;



        //保持deku的结构
        options.options = options;
        result = options;
    }


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
