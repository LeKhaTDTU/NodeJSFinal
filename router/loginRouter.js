const express = require('express')
const con = require('../database/db')
const app = express.Router()
const accountData = require('../model/account/accountModel')
const bcrypt = require('bcrypt')



app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store')
    const error = ''
    // console.log(req.session.user)
    if(req.session.user) {
        return res.redirect('/')
    }

    res.render('login', {error: error, username: '', password: ''})

})

app.post('/',  (req, res) => {
    const { username, password } = req.body;
    console.log(username)
    let error_msg = ''
    
        // Fetch the hashed password from the database
        const selectQuery = 'SELECT * FROM Users WHERE username = ?';
        const param = [username]
        con.query(selectQuery, param, (selectErr, selectResult) => {
            if (selectErr) {
                res.status(500).json({ error: selectErr });
            } else if(selectResult.length > 0) {

                const hashedPassword = selectResult[0].password;

                // Compare the provided password with the hashed password from the database
                const passwordMatch = bcrypt.compareSync(password, hashedPassword)
                if (passwordMatch) {
                    const {password, ...userData} = selectResult[0]
                    req.session.user = userData
                    console.log(req.session.user)
                    
                    // If first time log in the system and not admin, redirect to change password
                    if(selectResult[0].first_login && !selectResult[0].is_admin) {
                        return res.redirect('/set_password')
                    }
                    return res.redirect('/')
                } 
                // If wrong password, prompt user to try again
                error_msg = 'Wrong password, please try again'
                res.render('login', {error: error_msg, username: username, password: ''});            
            }
            else {
                error_msg = 'Wrong username or password'
                res.render('login', {error: error_msg, username: username, password: ''});
            }
        });

        // con.end()    
});


module.exports = app