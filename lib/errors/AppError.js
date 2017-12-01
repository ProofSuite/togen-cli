module.exports = class AppError extends Error {
  constructor (message, extra) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.extra = extra
  }
};
