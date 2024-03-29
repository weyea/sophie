var isPlainObject = function (obj) {

    if (typeof obj !== "object" || obj.nodeType) {
        //第一次过滤
        return false;
    }
    try {
        var hasOwn = Object.prototype.hasOwnProperty
        if (obj.constructor &&
            !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
    }
    catch (e) {
        return false;
    }
    return true
}

var utils = {
    ready: function (func) {
        if (window.jQuery) {
            jQuery(document).ready(func)
        }
        else {
            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", func, false);
        }
    },
    merge: function (o, m) {
        for (var p in m) {
            o[p] = m[p]
        }
    },


    // extend方法为jQuery对象和init对象的prototype扩展方法
// 同时具有独立的扩展普通对象的功能
    extend: function () {
        /*
        　　*target被扩展的对象
        　　*length参数的数量
        　　*deep是否深度操作
        　　*/
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            copyArray = false;
        var copyEntity = true

        // target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
        // deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
        // 然后把第二个参数赋值给target
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};

            // 将i赋值为2，跳过前两个参数
            i = 2;
        }

        if (target === 1) {
            deep = true;
            copyEntity = true;
            target = arguments[1] || {};

            // 将i赋值为2，跳过前两个参数
            i = 2;
        }

        if (target === 2) {
            deep = true;
            copyArray = true;
            copyEntity = true;
            target = arguments[1] || {};

            // 将i赋值为2，跳过前两个参数
            i = 2;
        }

        // target既不是对象也不是函数则把target设置为空对象。
        if (typeof target !== "object" && typeof target !== "function") {
            target = {};
        }

        // 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
        if (length === i) {
            target = this;

            // i减1，指向被扩展对象
            --i;
        }

        // 开始遍历需要被扩展到target上的参数

        for (; i < length; i++) {
            // 处理第i个被扩展的对象，即除去deep和target之外的对象
            if ((options = arguments[i]) != null) {
                // 遍历第i个对象的所有可遍历的属性
                for (name in options) {
                    // 根据被扩展对象的键获得目标对象相应值，并赋值给src
                    src = target[name];
                    // 得到被扩展对象的值
                    copy = options[name];

                    // 这里为什么是比较target和copy？不应该是比较src和copy吗？
                    if (target === copy) {
                        continue;
                    }

                    // 当用户想要深度操作时，递归合并
                    // copy是纯对象或者是数组
                    if (deep && copy && ( isPlainObject(copy) || (copyArray && (copyIsArray = Array.isArray(copy))) )) {
                        // if (deep && copy && isPlainObject(copy)) {
                        // 如果是数组
                        if (copyIsArray) {
                            // 将copyIsArray重新设置为false，为下次遍历做准备。
                            copyIsArray = false;
                            // 判断被扩展的对象中src是不是数组
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            // 判断被扩展的对象中src是不是纯对象
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        // 递归调用extend方法，继续进行深度遍历
                        target[name] = this.extend(deep, clone, copy);

                        // 如果不需要深度复制，则直接把copy（第i个被扩展对象中被遍历的那个键的值）
                    } else if (copy !== undefined && copyEntity) {
                        target[name] = copy;
                    }
                }
            }
        }

        // 原对象被改变，因此如果不想改变原对象，target可传入{}
        return target;
    }


}


module.exports = utils