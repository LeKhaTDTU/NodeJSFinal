const express = require('express')
const salepersonData = require('../model/account/accountModel')
const con = require('../database/db')
const bcrypt = require('bcrypt')
const app = express.Router()
const saltRounds = 10;
app.get('/', (req, res) => {
    salepersonData.getAllSalepersons()
    .then((salepersons) => {
        
        res.render('staff', {salepersons: salepersons, role: req.session.role, username: req.session.user})
    })
})

app.post('/', (req, res) => {
// Endpoint for adding a salesperson
    const { fullname, email } = req.body;
    console.log(fullname, email)
    // TODO: Insert data into the database and send back the added data
    // Example: Insert data using MySQL
    const sql = 'INSERT INTO Users (username, password, email, fullname, is_admin, is_locked) VALUES (?, ?, ?, ?, ?, ?)';
    const username = email.split('@')[0] // the part before '@' 
    const password = username
    bcrypt.hash(password, saltRounds, (err, hashed_password) => {
        if(err) {
            alert('Somethig went wrong')
        } else {
            con.query(sql, [username, hashed_password, email, fullname, 0, 0], (err, result) => {
                if (err) {
                  console.error('Error:', err);
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log('Add new user successfully')
                    res.redirect('/')
                }
            });
        }

    }) 
    
})

module.exports = app