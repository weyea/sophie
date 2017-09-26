var Register = require("./register");

module.exports = function(tagName, prototype, extendClass){
  return  Register.register.apply(null,arguments);
}
