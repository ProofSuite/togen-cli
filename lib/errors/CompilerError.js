let AppError = require('./AppError.js')

module.exports = class CompilerError extends AppError {
  constructor (message, errors) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.errors = errors
  }
};