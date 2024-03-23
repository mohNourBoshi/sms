// Import required modules
const express = require('express');
const fs = require('fs');

// Create an instance of express
const app = express();

// Define a route that responds with "Hi" when accessed
app.get('/', (req, res) => {
  res.send('Hi');
});

app.post('/sms/:idnum', express.json(),(req, res) => {
    let num= req.params.idnum
   let i = req.body
   i =JSON.stringify(i)

   fs.readFile(`${num}.txt`, 'utf8', (err, data) => {
     if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      let dataArray = [];
      if (data) {
          // Parse existing data into an array
          try {
              dataArray= JSON.parse(data).arr
          } catch (parseErr) {
              console.error("Error parsing JSON:", parseErr);
              res.status(500).send("Error parsing JSON");
              return;
          }
      }
       // Add incoming data to the array
       dataArray.push(req.body);

       // Write the updated array back to the file
       fs.writeFile(`${num}.txt`, JSON.stringify({arr:dataArray}), (writeErr) => {
        if (writeErr) {
            console.error("Error writing file:", writeErr);
            res.status(500).send("Error writing file");
            return;
        }
        console.log("Data saved successfully");
        res.status(200).send("Data saved successfully");
    });
     
    });

//    let j = req
   console.log(i,num)
  //  res.json({ savedData: i });
});



// Route to handle POST requests
app.get('/sms/:idnum', (req, res) => {
    let num= req.params.idnum

    // Read the number from the file
    fs.readFile(`${num}.txt`, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ massage: data });
      
    });
  });
  



  
// Define the port number
const port = 3000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
