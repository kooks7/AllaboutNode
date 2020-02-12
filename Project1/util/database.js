const mysql = require('mysql2');

// 새로운 연결을 계속 만드는것은 비효율적이다. 따라서 연결 풀을 만들어야 한다.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: '1325'
});

module.exports = pool.promise();
