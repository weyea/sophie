
var _element = require('../element');

function mountAfterElement(vnode){

      if ((0, _element.isThunk)(vnode)) {

        var component = vnode;
        //保留输出，setState，进行对比
        var output = component.vnode;

        if(component.componentAfterMount){
          component.componentAfterMount();

        }
        output.children.forEach(function (node, index) {
          if (node === null || node === undefined) {
            return;
          }
          var child = mountAfterElement(node);

        });



      }
      else {
        var children = vnode.children;
        if(children){
          children.forEach(function (node, index) {
            if (node === null || node === undefined) {
              return;
            }
            var child = mountAfterElement(node);

          });
        }



      }
}
function mountBeforeElement(vnode){


    if ((0, _element.isThunk)(vnode)) {

      var component = vnode;
      //保留输出，setState，进行对比
      var output = component.vnode;
      output.children.forEach(function (node, index) {
        if (node === null || node === undefined) {
          return;
        }
        var child = mountBeforeElement(node);

      });

      if (component.onCreate) component.onCreate();
      if(component.componentDidMount){
        component.componentDidMount();

      }

    }
    else {
      var children = vnode.children;
      if(children){
        children.forEach(function (node, index) {
          if (node === null || node === undefined) {
            return;
          }
          var child = mountBeforeElement(node);

        });
      }



    }
}

function mountElement(vnode) {
  mountBeforeElement(vnode);
  mountAfterElement(vnode);

}

module.exports = mountElement;
