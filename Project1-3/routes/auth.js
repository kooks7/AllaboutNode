const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('올바른 이메일을 입력해주세요.')
      // E-mail 이미 존재하는지 체크 하는 로직
      .custom(value => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('이메일이 이미 존재합니다.');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.updateStatus
);

module.exports = router;
