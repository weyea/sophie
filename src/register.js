var Utils = require("./utils");
var EE = require("./event")
var element = require("./element");
import {dom, diff, vnode} from "../lib/deku/src/index";

var StyleSheet = require("./styleSheet");
var merge = require("merge");
var currentOwner = require("./currentOwner");
var registry = {};

var SophieBaseClass = require("./BaseClass")

import {initClass} from "./InitClass"

function register(inName, inOptions, ExtendClass) {

    if (typeof inName !== "string") {
        ExtendClass = inOptions
        inOptions = inName;
        inName = undefined
    }

    var definition = inOptions || {};
    definition.name = inName || definition.name;


    var SohpieConstructor = function (props, children, owner) {
        initClass.apply(this, arguments)
    }


    //只能扩展Sophie类
    if (ExtendClass && (ExtendClass === SophieBaseClass || ExtendClass.prototype instanceof SophieBaseClass)) {
        SohpieConstructor.prototype = Object.create(ExtendClass.prototype)
        SohpieConstructor.prototype.super = ExtendClass.prototype;
    }
    else {

        SohpieConstructor.prototype = Object.create(SophieBaseClass.prototype)
        SohpieConstructor.prototype.super = SophieBaseClass.prototype;
    }





    resolveTagName(definition);
    resolveMixin(definition);


    var oldConstructor = definition.constructor
    var oldGetDefaultProps = definition.getDefaultProps
    var getDefaultChildren = definition.getDefaultChildren;
    var oldGetInitState = definition.getInitialState;
    var oldRender = definition.render

    var oldComponentDidMount = definition.componentDidMount
    var oldComponentWillMount = definition.componentWillMount
    var oldComponentDidUpdate = definition.componentDidUpdate


    definition.getDefaultProps = function () {
        var defaultProps = {}
        if (ExtendClass && ExtendClass.prototype.getDefaultProps) {
            defaultProps = ExtendClass.prototype.getDefaultProps.apply(this, arguments)
        }
        var thisDefault = oldGetDefaultProps && oldGetDefaultProps.apply(this, arguments)
        return merge({}, defaultProps || {},thisDefault || {})
    }

    definition.getDefaultChildren = function () {
        if (!getDefaultChildren) {
            if (ExtendClass && ExtendClass.prototype.getDefaultChildren) {
                return ExtendClass.prototype.getDefaultChildren.apply(this, arguments) || []
            }
        }
        else {
            return getDefaultChildren.apply(this, arguments) || []
        }
    }

    definition.getInitialState = function () {
        var superState = {}
        if (ExtendClass && ExtendClass.prototype.getInitialState) {
            superState = ExtendClass.prototype.getInitialState.apply(this, arguments)
        }
        var thisState = oldGetInitState && oldGetInitState.apply(this, arguments)
        return merge({},  superState || {},thisState || {})
    }

    definition._constructor = function () {
        if (ExtendClass && ExtendClass.prototype._constructor) {
            ExtendClass.prototype._constructor.apply(this, arguments)
        }
        oldConstructor && oldConstructor.apply(this, arguments)

    }


    //for decleare
    // SohpieConstructor.prototype.getDefaultProps = function(){}
    // SohpieConstructor.prototype.getInitialState = function(){}


    if (oldRender) {
        definition.render = function () {
            var oldOwnerDocument =  currentOwner.target
            currentOwner.target = this;
            var result = oldRender.apply(this, arguments);
            currentOwner.target = oldOwnerDocument ||  undefined;
            return result;
        }
    }

    if (oldComponentDidMount) {
        definition.componentDidMount = function () {
            if (!this._didMount) {
                this._didMount = true
                oldComponentDidMount && oldComponentDidMount.apply(this, arguments)
                EE.trigger("componentDidMount", [this])
            }

        }
    }
    if (oldComponentDidMount) {
        definition.componentDidUpdate = function () {
            oldComponentDidUpdate && oldComponentDidUpdate.apply(this, arguments)
            EE.trigger("componentDidUpdate", [this])
        }
    }


    if (oldComponentWillMount) {
        definition.componentWillMount = function () {
            oldComponentWillMount && oldComponentWillMount.apply(this, arguments)
            EE.trigger("oldComponentWillMount", [this])
        }
    }


    Utils.merge(SohpieConstructor.prototype, definition);


    SohpieConstructor.prototype.constructor = SohpieConstructor
    SohpieConstructor.createStyleSheet = function (styles, mediaQuery) {
        StyleSheet.create(styles, mediaQuery, inName)
    }


    if (inName) {
        registerDefinition(inName, SohpieConstructor);
        document.createElement(inName);
    }

    return SohpieConstructor;
}

function resolveTagName(inDefinition) {
    if (inDefinition.name) {
        inDefinition.tagName = inDefinition.name;
        inDefinition.type = inDefinition.name;
    }

}


function resolveMixin(inDefinition) {
    var mixin = inDefinition.mixin || [];
    for (var i = 0; i < mixin.length; i++) {
        var pDefinition = mixin[i];
        for (var p in pDefinition) {
            if (!inDefinition[p]) {
                inDefinition[p] = pDefinition[p];
            }
        }
    }
}

function registerDefinition(inName, inDefinition) {
    registry[inName] = inDefinition;
}


function isLeaf(inElement) {
    if (inElement) {
        var name = inElement.tagName.toLowerCase();
        return registry[name];
    }
}


module.exports = {
    registry: registry,
    isLeaf: isLeaf,
    register: register
}
