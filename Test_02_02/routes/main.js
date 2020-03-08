const express = require('express');
const router = express.Router();
const addData = require('./add');

router.get('/', (req, res, next) => {
  res.render('main', {
    contents: 'contents'
  });
});

module.exports = router;
