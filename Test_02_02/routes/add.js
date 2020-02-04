const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const contents = [];

router.get('/', (req, res, next) => {
  res.render('add');
});

router.post('/', (req, res, next) => {
  contents.push({ title: req.body.addCon });
  //   console.log('111', contents[0].title);
  res.redirect('/');
});

module.exports = {
  router: router,
  con: contents
};
