import setNativeAttribute from '@f/set-attribute'
import isValidAttribute from '@f/is-valid-attr'
import isFunction from '@f/is-function'
import indexOf from 'index-of'
import setValue from 'setify'
import events from './events'

export function removeAttribute(DOMElement, name, previousValue) {
    let eventType = events[name]
    if (eventType && isFunction(previousValue)) {
        DOMElement.removeEventListener(eventType, previousValue)
        return
    }
    switch (name) {
        case 'checked':
        case 'disabled':
        case 'selected':
            DOMElement[name] = false
            break
        case 'innerHTML':
        case 'nodeValue':
        case 'value':
            DOMElement[name] = ''
            break
        default:
            DOMElement.removeAttribute(name)
            break
    }
}

export function setAttribute(DOMElement, name, value, previousValue) {

    if (name == "html" && DOMElement.tagName.toLowerCase() == "article") {
        DOMElement.innerHTML = value;
        return;
    }

    let eventType = events[name]
    if (value === previousValue) {
        return
    }
    if (eventType) {
        if (isFunction(previousValue)) {
            DOMElement.removeEventListener(eventType, previousValue)
        }
        DOMElement.addEventListener(eventType, value)
        return
    }
    if (!isValidAttribute(value)) {
        removeAttribute(DOMElement, name, previousValue)
        return
    }
    switch (name) {
        case 'checked':
        case 'disabled':
        case 'innerHTML':
        case 'nodeValue':
            DOMElement[name] = value
            break
        case 'selected':
            DOMElement.selected = value
            // Fix for IE/Safari where select is not correctly selected on change
            if (DOMElement.tagName === 'OPTION' && DOMElement.parentNode) {
                let select = DOMElement.parentNode
                select.selectedIndex = indexOf(select.options, DOMElement)
            }
            break
        case 'value':
            setValue(DOMElement, value)
            break
        default:
            setNativeAttribute(DOMElement, name, value)
            break
    }
}
