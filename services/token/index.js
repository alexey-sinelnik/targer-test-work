const jwt = require('jsonwebtoken');
const TokenModel = require('../../models/token');

class TokenService {
  async generateJWTToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, token) {
    const data = await TokenModel.findOne({ user: userId }, null, null);
    if (data) {
      data.refreshToken = token;
      return data.save();
    }

    return TokenModel.create({ user: userId, refreshToken: token }, null);
  }

  async removeRefreshToken(token) {
    return TokenModel.deleteOne({ refreshToken: token });
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (e) {
      return e;
    }
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return e;
    }
  }

  async findToken(token) {
    return TokenModel.findOne({ refreshToken: token }, null, null);
  }
}

module.exports = new TokenService();
