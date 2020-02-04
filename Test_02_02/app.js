const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

const mainRouter = require('./routes/main');
const addRouter = require('./routes/add');

app.use('/add', addRouter.router);
app.use('/', mainRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);
