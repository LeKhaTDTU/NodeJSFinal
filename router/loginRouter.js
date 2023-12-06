const express = require('express')
const con = require('../database/db')
const app = express.Router()
const accountData = require('../model/account/accountModel')
const bcrypt = require('bcrypt')



app.get('/', (req, res) => {
    const error = ''
    console.log(req.session.user)
    if(req.session.user) {
        return res.redirect('/')
    }

    res.render('login', {error: error})

})

app.post('/',  (req, res) => {
    const { username, password } = req.body;
    const error_msg = ''
    try {
      // Fetch the hashed password from the database
      const selectQuery = 'SELECT * FROM Users WHERE username = ?'; // Assuming admin user has id 1
      con.query(selectQuery, [username], (selectErr, selectResult) => {
        if (selectErr) {
          console.error('Our fault, not yours');
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (selectResult.length > 0) {
                const hashedPassword = selectResult[0].password;

                // Compare the provided password with the hashed password from the database
                const passwordMatch = bcrypt.compareSync(password, hashedPassword)
                if (passwordMatch) {
                    req.session.user = selectResult[0].username
                    req.session.role = selectResult[0].is_admin
                    req.session.user_id = selectResult[0].user_id
                    req.session.first_login = selectResult[0].first_login
                    if(selectResult[0].first_login && !selectResult[0].is_admin) {
                        return res.redirect('/set_password')
                    }
                    return res.redirect('/')
                } else {
                    error = 'Your password is wrong.'
                    res.render('login', {error: error_msg});
                }
            } else {
                error = 'Wrong username or password'
                res.render('login', {error: error_msg});
            }
        }
      });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = app