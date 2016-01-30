
var _element = require('../element');
function mountElement(vnode) {




  if ((0, _element.isThunk)(vnode)) {

    var component = vnode.component;


    //保留输出，setState，进行对比
    var  output = component.vnode;

    output.children.forEach(function (node, index) {
      if (node === null || node === undefined) {
        return;
      }
      var child = mountElement(node);

    });

    if (component.onCreate) component.onCreate(model);
    if(component.componentDidMount){
      component.componentDidMount();
    }



  }


}

module.exports = mountElement;
