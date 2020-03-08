const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const content = sequelize.define('content', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  bean: Sequelize.STRING,
  temperature: Sequelize.INTEGER,
  time: Sequelize.INTEGER,
  usingTool: Sequelize.TEXT,
  image: Sequelize.TEXT,
  content: Sequelize.TEXT
});

router.get('/', (req, res, next) => {
  res.render('add');
});

router.post('/', (req, res, next) => {
  console.log('1111', req.body.title);
  console.log('1111', req.body.imageUrl);
  console.log('1111', req.body.content);

  // <input type="text" name="title" value="title"/>
  // <input type="text" name="bean" />
  // <input type="number" name="temperature" />
  // <input type="time" name="time" />
  // <input type="text" name="usingTool" />
  // <input type="text" name="image" />

  content
    .create({
      title: req.body.title,
      bean: req.body.bean,
      temperature: req.body.temperature,
      time: req.body.time,
      usingTool: req.body.usingTool,
      image: req.body.image,
      content: req.body.content
    })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  res.redirect('/');
});

module.exports = router;
