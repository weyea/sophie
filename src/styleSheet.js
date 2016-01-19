

var ObjectToCssText = function(styles, mediaQuery){
  var cssText = ""
  for(var selector in styles){
    cssText+=selector+"{";
    var values = styles[selector];
    for(var name in values){
      cssText += name+":"+values[name]+";"
    }
    cssText += "}"
  }



  if(mediaQuery){
    cssText = mediaQuery+"{"+cssText+"}";
  }

  return cssText;
}
var head;

var StyleSheet = {
  create: function(styles){
    if(!head){
       head = document.getElementsByTagName("head")[0];
    }

    var style = document.createElement("style");
    var cssText = ObjectToCssText(styles);
    style.innerText = cssText
    head.appendChild(style);

  }
}

module.exports = StyleSheet
