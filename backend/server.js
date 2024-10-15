const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // To enable CORS for requests from your React app

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Allow requests from the frontend

// Create MySQL connection
const db = mysql.createPool({
  connectionLimit: 10, // Adjust as needed
  host: 'localhost',
  user: 'root',
  password: 'Mrwizard@19', // Replace with your actual password
  database: 'base' // Replace with your database name
});

// Endpoint to handle data submission
app.post('/add-product', (req, res) => {
  const { id, barcode, productName } = req.body;

  const sql = 'INSERT INTO products (id, barcode, product_name) VALUES (?, ?, ?)';
  db.query(sql, [id, barcode, productName], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.status(500).send('Failed to insert data: ' + err.message);
    }
    res.send('Data inserted successfully!');
  });
});

// Endpoint to search for a product by name
app.get('/search-product', (req, res) => {
  const { name } = req.query;

  const sql = 'SELECT * FROM products WHERE product_name = ?';
  db.query(sql, [name], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      return res.status(500).send('Failed to fetch data: ' + err.message);
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Endpoint to fetch all products
app.get('/all-products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).send('Failed to fetch products: ' + err.message);
    }
    res.json(results);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
