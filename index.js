// Import required modules
const express = require('express');

// Create an instance of express
const app = express();

// Define a route that responds with "Hi" when accessed
app.get('/', (req, res) => {
  res.send('Hi');
});

app.post('/sms', (req, res) => {
  res.send('Hi');
});

// Define the port number
const port = 3000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
