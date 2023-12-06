const express = require('express')
const con = require('../database/db')
const productData = require('../model/product/ProductModel')
const app = express.Router()

let categories = new Set()

    


app.get('/', (req, res) => {
    const {product_name} = req.query
    console.log(product_name)
    if(!product_name) {
        productData.executeQuery()
        .then((products) => {
            products.forEach(p => {
                categories.add(p.category)
            })
            
            res.render('transaction', {products, categories, username: req.session.user, role: req.session.role})
        })
        .catch((err) => {
            res.send(err)
        })
    }
    else {
        productData.getProductByName(product_name)
        .then((products) => {
            res.render('transaction', {products, categories, username: req.session.user, role: req.session.role})
        })
        .catch((err) => {
            res.send(err)
        })
    }
        

})

app.get('/:category', (req, res) => {
    
    const {category} = req.params
    const param = [category]
    if(category === 'action') {
        return res.redirect('/action')
    }

    if(category === 'apple') {
        productData.getProductByManufacturer(category) 
        .then((products) => {
            return res.render('transaction', {products, categories, username: req.session.user, role: req.session.role})
        })
        .catch((err) => {
            return res.send('Something went wrong =((')
        })
    }
    else {
        productData.getProductCategory(category)
        .then((products) => {
            res.render('transaction', {products, categories, username: req.session.user, role: req.session.role})
        })
    }
    
})









module.exports = app
