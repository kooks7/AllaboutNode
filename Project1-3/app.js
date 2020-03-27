const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/test';

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json()); //application/json

// CORS 해결하기
// '*' 모든 URL에서 오는 request 허용
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
