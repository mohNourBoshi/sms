// Import required modules
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const domain = 'https://nour.ham.gd/sms/'

// Create an instance of express
const app = express();
app.use(cors());

app.use(express.static('public'));


app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/sms/code/fawzi/code', (req, res) => {
  res.send('1')
});

// Route to list all numbers
app.get('/sms/all', (req, res) => {
  fs.readdir(path.join(__dirname, 'nums'), (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const numbers = files.map(file => path.parse(file).name);
    res.json({ numbers });
  });
});
// Define a route that responds with "Hi" when accessed
app.post('/test', (req, res) => {
  console.log(req.body)
  res.send('Hi');
});

app.get('/sms/new/:idnum', (req, res) => {
  let num = req.params.idnum

  // Read the number from the file
  fs.readFile(path.join('nums', `${num}.txt`), 'utf8', (err, data) => {
    if (err) {

      console.error('Error reading file:', err);
      fs.writeFile(path.join('nums', `${num}.txt`), JSON.stringify({ arr: [] }), (writeErr) => {
        if (writeErr) {
          res.status(500).send("Error writing file");
          return;
        }
        console.log("new file named with  " + num);
      });
      return res.status(200).json({ 'response': 'تم انشاء رابط ', 'link': domain + num });
    } else {

      res.json({ massage: "الرقم موجود مسبقا", 'link': domain + num });
    }

  });
});


app.post('/sms/:idnum', express.json(), (req, res) => {
  let num = req.params.idnum
  let i = req.body
  i = JSON.stringify(i)



  fs.readFile(path.join('nums', `${num}.txt`), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let dataArray = [];
    if (data) {
      // Parse existing data into an array
      try {
        dataArray = JSON.parse(data).arr
      } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
        res.status(500).send("Error parsing JSON");
        return;
      }
    }
    // Add incoming data to the array
    dataArray.push(req.body);

    // Write the updated array back to the file
    fs.writeFile(path.join('nums', `${num}.txt`), JSON.stringify({ arr: dataArray }), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        res.status(500).send("Error writing file");
        return;
      }
      console.log({ arr: dataArray });
      console.log("Data saved successfully");
      res.status(200).send({ arr: dataArray });
    });

  });

  console.log(i, num)
});



app.get('/sms/all/:idnum', (req, res) => {
  let num = req.params.idnum

  // Read the number from the file
  fs.readFile(path.join('nums', `${num}.txt`), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ massage: data });
  });
});
// Route to handle POST requests
app.get('/sms/:idnum', (req, res) => {
  let num = req.params.idnum

  // Read the number from the file
  fs.readFile(path.join('nums', `${num}.txt`), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    try {
      data = JSON.parse(data)
      let mota_massage = []
      data.arr.forEach(element => {
        let str = element.from.toLowerCase()
        if (str === "mota") {
          mota_massage.push(element.content)
        }

      });
      data.arr = mota_massage;
      res.json({ massage: data });
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return res.status(500).json({ error: 'Error parsing JSON' });
    }
  });
});
// Define the port number
const port = 3000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
