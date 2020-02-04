const express = require('express');
const router = express.Router();
const addData = require('./add');

router.get('/', (req, res, next) => {
  console.log(addData.con);
  const contents = addData.con;
  res.render('main', {
    contents: contents
  });
});

module.exports = router;
