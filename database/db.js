const mysql = require('mysql')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'dkkhoa',
    password: 'dkkhoa123',
    database: 'POS'
})

module.exports = con
