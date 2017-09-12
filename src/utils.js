

module.exports = {
        ready: function (func) {
          if (window.jQuery) {
              jQuery( document ).ready(func)
            }
            else {
                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", func, false);
            }
        },
        merge:function(o, m){
            for(var  p in m){
                o[p] = m
            }
        }

    }
