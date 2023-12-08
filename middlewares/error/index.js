const AppException = require('../../common/errors/api-exception');

module.exports = function (error, req, res, next) {
  if (error instanceof AppException)
    return res
      .status(error.status)
      .json({ message: error.message, errors: error.errors });

  return res.status(500).json({ message: 'Server error' });
};
