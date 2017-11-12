Object.prototype.filterValues = function(predicate){
  let obj = this;
  var result = {}, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
}

Object.prototype.isSet = function() {
  return !(Object.keys(this).length === 0 && this.constructor === Object)
}

String.prototype.camelize = function() {
  return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

Array.prototype.camelize = function() {
  let camelized = this.map((element) => { return element.camelize() })
  return camelized
}

String.prototype.uncamelize = function(separator = " ") {
  let text = this
  text = text.replace(/[A-Z]/g,  (letter) => separator + letter.toUpperCase()).replace("/^" + separator + "/", '');
  text = text.charAt(0).toUpperCase(0) + text.slice(1);
  return text;
}

Array.prototype.uncamelize = function() {
  let uncamelized = this.map((element) => { return element.uncamelize() })
  return uncamelized
}

String.prototype.capitalize = function(separator = " ") {
  return this.charAt(0).toUpperCase(0) + this.slice(1);
}
