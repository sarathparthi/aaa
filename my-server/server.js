import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 5000; // Port number for your server

app.use(express.json());

// Route to handle product search
app.get('/search-product', (req, res) => {
  const productName = req.query.name;
  // Replace with actual database check
  const product = checkProductInDatabase(productName);
  
  if (product) {
    res.json({ found: true, id: product.id });
  } else {
    res.json({ found: false });
  }
});

// Simulated database check
function checkProductInDatabase(name) {
  // Simulate a database check
  if (name === 'Example Product') {
    return { id: '1234', barcode: '5678', product_name: 'Example Product' };
  }
  return null;
}

// Route to notify Arduino
app.post('/notify-arduino', async (req, res) => {
  const { id } = req.body;
  // Define the Arduino endpoint
  const arduinoUrl = 'http://arduino-ip/trigger-action';

  try {
    const response = await fetch(arduinoUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      res.status(200).send('Arduino notified successfully');
    } else {
      res.status(500).send('Failed to notify Arduino');
    }
  } catch (err) {
    res.status(500).send('Error notifying Arduino');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

