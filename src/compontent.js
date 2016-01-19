var Register = require("./register");

module.exports = function(tagName, prototype){
  return  Register.register(tagName,prototype);
}
