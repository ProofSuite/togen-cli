function promiseError(msg) {
  var newError = new Error(msg)
  return e => {
    newError.originalError = e;
    throw newError;
  }
}

module.exports = promiseError