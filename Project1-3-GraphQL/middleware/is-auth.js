const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    // 2번째 인자는 이전에 설정했던 토큰 암호
    decodedToken = jwt.verify(token, 'somesupersupersecretfromminjae');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    err.statusCode = 401;
    throw error;
  }
  // decode 됐기 때문에 이전에 설정해주었던 userId에 접근할 수 있다.
  req.userId = decodedToken.userId;
  next();
};
