const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); //adminRouts() x
app.use(shopRoutes);

// 미들웨어는 위에서 아래로 진행하므로 404 페이지는 맨 아래 작성!
app.use(errorController.get404);

app.listen(3000);
