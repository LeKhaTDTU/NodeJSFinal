const express = require('express')
const bcrypt = require('bcrypt')
const con = require('../database/db')
const saltRounds = 10

const app = express.Router()

app.get('/', (req, res) =>{
    let error_msg = ''
    res.render('setpassword', {error: error_msg})
})

app.post('/', async (req, res) => {
    const user_id = req.session.user_id
    const { currentPassword, newPassword } = req.body;
    let error_msg = ''

    con.query('SELECT * FROM Users where user_id = ?', [user_id], (err, result) => {
        if(err) {
            console.log('Error: ' + err)
        }
        else if(result.length > 0) {
            const hashedPassword = result[0].password;

            // Compare the provided password with the hashed password from the database
            const passwordMatch = bcrypt.compareSync(currentPassword, hashedPassword)
            if(passwordMatch) {
                bcrypt.hash(newPassword, saltRounds, (hashErr, hashed_password) => {
                    if(hashErr) {
                        console.log('Error occurs while hashing')
                    }
                    else {
                        con.query('UPDATE Users SET password = ?, first_login = ? WHERE user_id = ?', [hashed_password, 0, user_id], (updateErr, updateResult) => {
                            if(updateErr) {
                                console.log('Cannot change password now')
                                res.status(500).json({ error: 'Internal Server Error' });
                            }
                            else {
                                console.log('Change password successfully')
                                req.session.first_login = 0
                                res.redirect('/')
                            }
                        })
                    }
                })
            }
            else {
                console.log('Wrong password')
                error_msg = 'Wrong password'
                res.render('setpassword', {error: error_msg})
            }

        }
    })
});

module.exports = app