// db.js
const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abhi1234', // your MySQL password
  database: 'studentdb'
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

module.exports = conn;
