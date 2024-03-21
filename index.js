// Import required modules
const express = require('express');

// Create an instance of express
const app = express();

// Define a route that responds with "Hi" when accessed
app.get('/', (req, res) => {
  res.send('Hi');
});

app.post('/sms', express.json(),(req, res) => {
   let i = req.body.content
//    let j = req
   console.log(i)
  res.send(i);
});



// Route to handle POST requests
app.get('/num', (req, res) => {
    // Read the number from the file
    fs.readFile('number.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Parse the content of the file as a number
      let number = parseInt(data);
  
      // Increment the number by 1
      number++;
  
      // Write the incremented number back to the file
      fs.writeFile('number.txt', number.toString(), 'utf8', err => {
        if (err) {
          console.error('Error writing file:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        // Send the incremented number as a response
        res.json({ incrementedNumber: number });
      });
    });
  });
  
// Define the port number
const port = 3000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
