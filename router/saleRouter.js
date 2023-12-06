const express = require('express')
const con = require('../database/db')
const app = express.Router()


let selected_products = []

app.get('/', (req, res) => {
    const sql = 'Select * from'
})


const saleStatus = (req, res, next) => {
    if(selected_products.length === 0) {
        res.redirect('/products')
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
    
    const {products, total_cost, total_quantity, date, time, staff} = req.body

    
    if(products.length === 0) {
        console.log('No products selected')
    }
    else {
        selected_products = products
        products.forEach(p => {
            const {id, name, quantity, price} = p[1]
            console.log(id, name, quantity, price)
            const sql = 'insert into Products_sold(product_id, product_name, sell_price, quantity, sell_date) values(?, ?, ?, ?, ?)'
            const params = [id, name, price, quantity, date]
            
            con.query(sql, params, (err, results, fields) => {
                if(err) throw err
                if(results.affectedRows >= 1) {
                    console.log('Added to db successfully')
  
                }
                else {
                    console.log('Something went wrong')
                }
            })

            
        })

    }
})






module.exports = app
