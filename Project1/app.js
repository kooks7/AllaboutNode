const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// mongoDB 가져오기

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 이 함수는 즉시 실행되는 것이 아니라 요청이 들어오면 실행됨으로 서버 실행 후 실행된다.
// req.user라는 객체를 생성한다.
app.use((req, res, next) => {
  User.findById('5e4e1c88d7060d12b0b13fd0')
    .then(user => {
      // console.log(
      //   '123123',
      //   user.cart.items.map(e => {
      //     return e;
      //   })
      // );
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb://localhost:27017/test')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'MJ',
          email: 'busanminjae@naver.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
