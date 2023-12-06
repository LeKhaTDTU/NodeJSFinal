const express = require('express')
const con = require('../database/db')
const app = express.Router()
const accountData = require('../model/account/accountModel')



app.get('/login', (req, res) => {

    if(req.session.user) {
        return res.redirect('/')
    }

    res.render('login')

})


app.post('/login', (req, res) => {
    const {email, password} = req.body
    const params = [email, password]
    // console.log(email, password)
    let error = false

    accountData.getUser(params)
    .then((user) => {
        // console.log(user)
        if(user.length !== 0) {
            const username = email.split('@')[0]
            req.session.user = user[0].username
            req.session.role = user[0].is_admin
            req.session.user_id = user[0].user_id
            return res.redirect('/')
        }
        res.redirect('/user/login')
    })
    .catch((err) => {
        console.log(err)
    })

})



module.exports = app