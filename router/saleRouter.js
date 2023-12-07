const express = require('express')
const con = require('../database/db')
const app = express.Router()

let selected_products = []

app.get('/', (req, res) => {
    const sql = 'Select * from'
})


const saleStatus = (req, res, next) => {
    if(selected_products.length === 0) {
        res.redirect('/transaction')
        return ;
    }
    // After finishing transaction, delete all selected products
    selected_products = []
    next()
}

app.get('/complete', saleStatus, (req, res) => {
    res.render('complete')
})
app.post('/', (req, res) => {
    const {products, total_cost, total_quantity, date, time, amount_given_by_customer, change_to_customer} = req.body
    if(products.length === 0) {
        return res.redirect('/transaction')
    }

    // Assign value for selected_products
    selected_products = products
    // console.log(req.body)
    const sql = 'INSERT INTO Sales (total_quantity, total_price, amount_given_by_customer, change_to_customer, user_id) VALUES (?, ?, ?, ?, ?)'
    const params = [total_quantity, total_cost, amount_given_by_customer, change_to_customer, req.session.user.user_id]

    con.query(sql, params, (insertError, insertResult) => {
        if(insertError) {
            res.status(500).json({error: insertError})
        }
        else {
            console.log('Add to databse successfully')
        }
    })
})






module.exports = app
