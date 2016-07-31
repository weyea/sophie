  import {vnode}  from "../lib/deku/src/index";

function mountAfterElement(mountVnode){
      if (vnode.isThunk(mountVnode)) {
        var component = mountVnode.options;
        //保留输出，setState，进行对比
        var output = component.rootVnode;

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
        var children = mountVnode.children;
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
function mountBeforeElement(mountVnode){


      if (vnode.isThunk(mountVnode)) {

      var component = mountVnode.options;
      //保留输出，setState，进行对比
      var output = component.rootVnode;;
      output.children.forEach(function (node, index) {
        if (node === null || node === undefined) {
          return;
        }
        var child = mountBeforeElement(node);

      });


      if(component.componentDidMount){
        component.componentDidMount();

      }

    }
    else {
      var children = mountVnode.children;
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

function mountElement(mountVnode) {
  mountBeforeElement(mountVnode);
  mountAfterElement(mountVnode);

}

module.exports = mountElement;
