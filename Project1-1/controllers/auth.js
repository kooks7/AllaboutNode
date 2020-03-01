const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5e57bda2e4623e3ff0aa8362')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // 세션이 저장되고 다음 실행
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
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
