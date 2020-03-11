const express = require('express');
// JavaScript에서 제공하는 Destructuring 을 사용하여 check 함수를 가져오자
const { check, body } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Email을 입력해주세요'),
    body('password', '패스워드를 5글자 이상 또는 알파벳만 넣어주세요.')
      .isLength({ min: 5 })
      .isAlphanumeric()
  ],
  authController.postLogin
);

// 라우터에는 넣고싶은 만큼 라우터를 추가할 수 있다. 따라서 check() 를 넣어주고 인자로 form 을 넣어주자
router.post(
  '/signup',

  [
    body('email', 'E-mail exists already!')
      .isEmail()
      .withMessage('Please Enter a Valid Email')
      .custom((value, { req }) => {
        // 유저가 입력한 Eamil 존재하는지 DB에서 찾기
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            // Error 던지기
            return Promise.reject('E-mail exists already!!');
          }
        });
      }),
    //body(인자1, 인자2) => req.body로 날라오는 값을 검증
    // 인자1 : 검증할 값, 인자2: default 에러 메세지
    body(
      'password',
      'Please Enter a Password wiht only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      // 알파벳만 가능
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
