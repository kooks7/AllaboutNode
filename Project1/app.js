const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes); //adminRouts() x
app.use(shopRoutes);

// 미들웨어는 위에서 아래로 진행하므로 404 페이지는 맨 아래 작성!
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'NOT FOUND!!!!!' });
});

app.listen(3000);
