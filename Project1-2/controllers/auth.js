const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

// routes/auth.js에서 미리 설정했던 isEmail 함수에서 받아 오류 생성
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

// 깃 올리기 전에 따로 뺴기

fs.readFile(path.join(__dirname, '../api_key.json'), (err, api_key) => {
  if (err) {
    console.log(err);
  }
  const key = JSON.parse(api_key);
  sgMail.setApiKey(key);
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // flash(에러 이름, 메세지)
        req.flash('error', 'Invalid Email or Password!');
        return res.redirect('/login');
      }
      //bcrypt.compare(평문,해시값) => promise 리턴
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          // 패스워드까자 맞으면 실행
          if (doMatch) {
            // 세션에 로그인 상태 저장
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              return res.redirect('/');
            });
          }
          // 패스워드가 일치하지 않으면
          req.flash('error', 'Invalid Email or Password!');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // client 사이드에서 오류가 발생하면 req로 전달
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      // 이전 Input 다시 보내줘서 form value로 넣기
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      }
    });
  }

  // Email 겹치는지 확인하기

  // 패스워드 암호화 , 12번의 해싱
  return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      return sgMail.send({
        to: email,
        from: 'nodeshop@shop.com',
        subject: 'Signup suceeded!',
        html: '<h1>Hi! 회원가입을 축하합니다.</h1>'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    // hex 로 변경한다.
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        sgMail.send({
          to: req.body.email,
          from: 'nodeshop@shop.com',
          subject: 'Password reset',
          html: `
            <h2>패스워드 재설정</h2>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password. </p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() } // Expiration 시간이 지금보다 더 큰것
  })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        passwordToken: token,
        userId: user._id.toString()
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
};
