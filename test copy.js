const express = require('express');
const app = express();
const port = 8080;
const mysql = require('mysql');
const ejs = require('ejs');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'POS'
});

// Connect to the MySQL database
connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to the database');
});

// Set up the server
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Define a route to render the form
app.get('/', (req, res) => {
  // Extract the registered information from query parameters, if available
  const { name, phone, address } = req.query;

  res.render('test.ejs', { name: name || '', phone: phone || '', address: address || '' });
});

// Define a route to handle AJAX request for retrieving data
app.post('/retrieve-data', (req, res) => {
  const phone = req.body.phone;

  // Execute a SQL query to retrieve name and address based on phone number
  const query = 'SELECT name, address FROM customers WHERE phone = ?';
  connection.query(query, [phone], (error, results) => {
    if (error) throw error;

    // Send the retrieved data as a response
    if (results.length > 0) {
      const { name, address } = results[0];
      res.json({ name, address });
    } else {
      res.json({ name: '', address: '' });
    }
  });
});

// Define a route to handle registration form submission
app.post('/register', (req, res) => {
    const { newName, newPhone, newAddress } = req.body;
  
    // Execute a SQL query to insert the new account information
    const query = 'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)';
    connection.query(query, [newName, newPhone, newAddress], (error) => {
      if (error) throw error;
  
      // Redirect back to the main form with the registered information
      res.redirect(`/?name=${encodeURIComponent(newName)}&phone=${encodeURIComponent(newPhone)}&address=${encodeURIComponent(newAddress)}`);
    });
  });


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});