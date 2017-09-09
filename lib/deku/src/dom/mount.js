import {isThunk}  from "../element";


function mountBeforeElement(mountVnode){


    if (isThunk(mountVnode)) {

        var component = mountVnode;
        //保留输出，setState，进行对比

        //@todo 考虑rootVnode是 thunk
        var output = component.rootVnode;

        mountBeforeElement(output);


        if(component.componentDidMount){
            component.componentDidMount();

        }

    }
    else if(mountVnode.props&&mountVnode.props.children){
        var children = mountVnode.props.children;
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



function mountAfterElement(mountVnode){
    if (isThunk(mountVnode)) {
        var component = mountVnode;
        //保留输出，setState，进行对比
        var output = component.rootVnode;

        if(component.componentAfterMount){
            component.componentAfterMount();
        }
        mountAfterElement(output)

    }
    else if(mountVnode.props&&mountVnode.props.children){
        var children = mountVnode.props.children;
        if(children){
            children.forEach(function (node, index) {
                if (node === null || node === undefined) {
                    return;
                }
                 mountAfterElement(node);

            });
        }



    }
}

function mountElement(mountVnode) {
    mountBeforeElement(mountVnode);
    mountAfterElement(mountVnode);

}

export {
    mountElement
}


