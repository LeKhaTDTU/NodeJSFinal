//app.js
const express = require('express');
const port = 8080;
const session = require('express-session')

const transactionRouter = require('./router/transactionRouter')
const saleRouter = require('./router/saleRouter')
const loginRouter = require('./router/loginRouter')
const logoutRouter = require('./router/logoutRouter')
const loginMiddleware = require('./middlewares/loginMiddleware')
const addSalepersonRouter = require('./router/addSalepersonRouter')
const setPasswordRouter = require('./router/setPasswordRouter')
const profileRouter = require('./router/profileRouter')
const fistTimeLoginMiddleware = require('./middlewares/firstTimeLoginMiddleware')
const con = require('./database/db')

const app = express();
app.set('view engine', 'ejs')


app.use(session({
  secret: 'hello',
  resave: false,
  saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//user must login to use the system
app.use('/login', loginRouter)

//middleware to check if user logged in or not
app.use(loginMiddleware)

app.use(express.static(__dirname + '/public'));

app.use('/transaction', fistTimeLoginMiddleware, transactionRouter)
app.use('/sale', fistTimeLoginMiddleware, saleRouter)
app.use('/salepersons', addSalepersonRouter)
app.use('/logout', logoutRouter)
app.use('/set_password', setPasswordRouter)
app.use('/profile', fistTimeLoginMiddleware, profileRouter)
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store')

  // If first time login and not admin, redirect to change password
  // if(req.session.user.first_login && !req.session.user.is_admin) {
  //   return res.redirect('/set_password')
  // }
  if(!req.session.user) {
      return res.redirect('/login')
  }
  
  const user = req.session.user
  res.render('home', {user: user})

})
// Routes
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/users', (req, res) => {
//   res.sendFile(__dirname + '/public/users.html');
// });

// app.get('/customers', (req, res) => {
//   res.sendFile(__dirname + '/public/customers.html');
// });


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root123',
//   database: 'POS', // Change this to your database name
// });

// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL database');
//   }
// });

// // Endpoint for setting or updating the admin's password
// app.post('/set-password', async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   try {
//     // Fetch the hashed password from the database
//     const selectQuery = 'SELECT password FROM Admin WHERE id = 1'; // Assuming admin user has id 1
//     db.query(selectQuery, (selectErr, selectResult) => {
//       if (selectErr) {
//         console.error('Error fetching hashed password:', selectErr);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         if (selectResult.length > 0) {
//           const hashedPassword = selectResult[0].hashed_password;

//           // Compare the provided current password with the hashed password from the database
//           const passwordMatch = bcrypt.compareSync(currentPassword, hashedPassword);

//           if (passwordMatch) {
//             // Hash the new password
//             const newHashedPassword = bcrypt.hashSync(newPassword, saltRounds);

//             // Update the password in the database
//             const updateQuery = 'UPDATE Admin SET hashed_password = ? WHERE id = 1';
//             db.query(updateQuery, [newHashedPassword], (updateErr, updateResult) => {
//               if (updateErr) {
//                 console.error('Error updating password:', updateErr);
//                 res.status(500).json({ error: 'Internal Server Error' });
//               } else {
//                 res.status(200).send('Password changed successfully');
//               }
//             });
//           } else {
//             res.status(401).send('Current password is incorrect');
//           }
//         } else {
//           res.status(404).json({ error: 'Admin user not found' });
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error during password change:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// // Endpoint for user login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Fetch the hashed password from the database
//     const selectQuery = 'SELECT hashed_password FROM admin WHERE id = 1'; // Assuming admin user has id 1
//     db.query(selectQuery, (selectErr, selectResult) => {
//       if (selectErr) {
//         console.error('Error fetching hashed password:', selectErr);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         if (selectResult.length > 0) {
//           const hashedPassword = selectResult[0].hashed_password;

//           // Compare the provided password with the hashed password from the database
//           const passwordMatch = bcrypt.compareSync(password, hashedPassword);

//           if (username === 'admin' && passwordMatch) {
//             res.status(200).send('Authentication successful');
//           } else {
//             res.status(401).send('Authentication failed');
//           }
//         } else {
//           res.status(404).json({ error: 'Admin user not found' });
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Endpoint for adding a salesperson
// app.post('/api/salespersons', (req, res) => {
//   const { name, email } = req.body;

//   // TODO: Insert data into the database and send back the added data
//   // Example: Insert data using MySQL
//   const sql = 'INSERT INTO salespersons (name, email) VALUES (?, ?)';
//   db.query(sql, [name, email], (err, result) => {
//     if (err) {
//       console.error('Error:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       const insertedData = { id: result.insertId, name, email };
//       res.status(201).json(insertedData);
//     }
//   });
// });

// // Endpoint for fetching all salespersons
// app.get('/api/salespersons', (req, res) => {
//   // TODO: Fetch data from the database
//   // Example: Fetch data using MySQL
//   const sql = 'SELECT * FROM salespersons';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});