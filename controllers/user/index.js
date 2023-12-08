const userService = require('../../services/users');
const { validationResult } = require('express-validator');
const AppException = require('../../common/errors/api-exception');
const { AppErrors } = require('../../common/errors');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return next(
          AppException.BadRequestException(
            AppErrors.VALIDATE_ERROR,
            errors.array(),
          ),
        );
      const { email, password } = req.body;
      const user = await userService.registration(email, password);
      res.cookie('refresh_token', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return next(
          AppException.BadRequestException(
            AppErrors.VALIDATE_ERROR,
            errors.array(),
          ),
        );
      const { email, password } = req.body;
      const user = await userService.login(email, password);
      res.cookie('refresh_token', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      await userService.logout(refresh_token);
      res.clearCookie('refresh_token');
      return res.status(200).json('Success');
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      const user = await userService.refreshToken(refresh_token);
      res.cookie('refresh_token', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
