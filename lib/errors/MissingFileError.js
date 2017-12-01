let AppError = require('./AppError.js')

module.exports = class MissingFileError extends AppError {
  constructor (message, fileName) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.fileName = fileName
  }
};