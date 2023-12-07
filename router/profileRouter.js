const express = require('express')

const app = express.Router()

app.get('/', (req, res) => {
    res.render('profile', {user: req.session.user})
})

module.exports = app