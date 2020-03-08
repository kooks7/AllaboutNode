const Sequelize = require('sequelize');

const sequelize = new Sequelize('artista', 'root', '1325', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
