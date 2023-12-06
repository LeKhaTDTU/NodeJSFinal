const con = require('../../database/db')
const bcrypt = require('bcrypt');
exports.getOneSaleperson = (params) => {
    
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM Users WHERE email = ? AND password = ?', params, (err, results) => {
            if(err) {
                console.log(err)
                reject(err);
                return;
            }

            else resolve(results)
            
        })
    })
}

exports.getAllSalepersons = () => {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM Users', (err, results) => {
            if(err) {
                console.log(err)
                reject(err);
                return;
            }

            else resolve(results)
            
        })
    })
}


exports.getAdmin = (params) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM Users WHERE email = ? AND password = ?', params, (err, results) => {
            if(err) {
                console.log(err)
                reject(err);
                return;
            }

            else resolve(results)
            
        })
    })
}