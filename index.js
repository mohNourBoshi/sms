// Import required modules
const express = require('express');
const fs = require('fs');

// Create an instance of express
const app = express();

// Define a route that responds with "Hi" when accessed
app.post('/test', (req, res) => {
  console.log(req.body)
  res.send('Hi');
});
// app.get('/nouh', (req, res) => {
//   console.log(req.body)
//   console.log(`${req}`)
  
//   // let hi = req
//   res.send("the page is not working try again later ");
// });

app.get('/nouh', (req, res) => {
  // Log request body and headers to console
  console.log("Request Body:", req.body);
  console.log("Request Headers:", req.headers);
  
  // Convert request object to string
  const requestData = JSON.stringify({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  }, null, 2); // null, 2 for pretty formatting
  
  // Save request to text file
  fs.writeFile('request.txt', requestData, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      res.status(500).send("Error writing to file");
    } else {
      console.log("Request saved to file: request.txt");
      res.status(200).send("Request saved to file");
    }
  });
});
app.get('/read', (req, res) => {
  fs.readFile('request.txt', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
      return;
    }
    res.send(data);
  });
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
        console.log({arr:dataArray});
        console.log("Data saved successfully");
        res.status(200).send({arr:dataArray});
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
  
  // a.from
  // a.date
  // a.content



  
// Define the port number
const port = 3000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
