const mysql = require('mysql2')

const con = mysql.createConnection({
    // connectionLimit: 20,
    // host: 'localhost',
    // user: 'dkkhoa',
    // password: 'dkkhoa123',
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pos'
})

module.exports = con
