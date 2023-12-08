module.exports = class AppException extends Error {
  status;
  errors;
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedException() {
    return new AppException(401, 'Unauthorized');
  }

  static BadRequestException(message, errors = []) {
    return new AppException(400, message, errors);
  }
};
