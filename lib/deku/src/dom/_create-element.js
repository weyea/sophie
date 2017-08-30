/**
 * Modules
 */

var isSvg = require('@f/is-svg')
var svgNs  = 'http://www.w3.org/2000/svg'

/**
 * Expose createElement
 */

module.exports = createElement

/**
 * createElement
 */

function createElement (tag) {
    return isSvg(tag)
        ? document.createElementNS(svgNs, tag)
        : document.createElement(tag)
}
