var CSSPropertyOperations = require('./CSSPropertyOperations')

var ObjectToCssText = function(styles, mediaQuery){
  var cssText = ""
  for(var selector in styles){
    cssText+=selector+"{"+CSSPropertyOperations.createMarkupForStyles(styles[selector])+ "}"
  }



  if(mediaQuery){
    cssText = mediaQuery+"{"+cssText+"}";
  }

  return cssText;
}
var head;

var StyleSheet = {
  create: function(styles,mediaQuery){
    if(!head){
       head = document.getElementsByTagName("head")[0];
    }

    var style = document.createElement("style");
    var cssText = ObjectToCssText(styles,mediaQuery);
    style.innerText = cssText
    head.appendChild(style);

  }
}

module.exports = StyleSheet
