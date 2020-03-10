const express = require('express');
// JavaScript에서 제공하는 Destructuring 을 사용하여 check 함수를 가져오자
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

// 라우터에는 넣고싶은 만큼 라우터를 추가할 수 있다. 따라서 check() 를 넣어주고 인자로 form 을 넣어주자
router.post(
  '/signup',

  [
    check('email')
      .isEmail()
      .withMessage('Please Enter a Valid Email')
      .custom((value, { req }) => {
        if (value === 'test@test.com') {
          throw new Error('This Email Address if forbidden.');
        }
        // default case
        return true;
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
