module.exports = function(url, complete){
  if(jQuery){
    jQuery.getScript(url, complete)
  }
  else {
    console.error("不存在getScript方法")
  }

}
