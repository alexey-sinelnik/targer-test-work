const UserModel = require('../../models/user');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenService = require('../../services/token');
const UserDto = require('../../common/dto');
const { AppErrors } = require('../../common/errors');
const AppException = require('../../common/errors/api-exception');

class UsersService {
  async generateAndSaveTokens(user) {
    const userDto = new UserDto(user);
    const userTokens = await tokenService.generateJWTToken({ ...userDto });
    const tokens = await tokenService.saveRefreshToken(
      userDto.id,
      userTokens.refreshToken,
    );

    return {
      user: userDto,
      ...userTokens,
    };
  }

  async registration(email, password) {
    const user = await UserModel.findOne({ email }, null, null);
    if (user) throw AppException.BadRequestException(AppErrors.USER_EXIST);

    const salt = await bcrypt.genSalt();

    const activationLink = uuid.v4();

    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create(
      { email, password: hashPassword, activationLink },
      null,
    );
    return this.generateAndSaveTokens(newUser);
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email }, null, null);
    if (!user) throw AppException.BadRequestException(AppErrors.USER_NOT_EXIST);
    const isPasswordValidate = await bcrypt.compare(password, user.password);
    if (!isPasswordValidate)
      throw AppException.BadRequestException(AppErrors.WRONG_DATA);
    return this.generateAndSaveTokens(user);
  }

  async logout(token) {
    return tokenService.removeRefreshToken(token);
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) throw AppException.UnauthorizedException();
    const userFromToken = tokenService.validateRefreshToken(refreshToken);
    const existRefreshToken = await tokenService.findToken(refreshToken);
    if (!existRefreshToken || !userFromToken)
      throw AppException.UnauthorizedException();

    const user = await UserModel.findById(userFromToken.id);
    return this.generateAndSaveTokens(user);
  }
}

module.exports = new UsersService();
