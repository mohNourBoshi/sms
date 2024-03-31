// Import required modules
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Create an instance of express
const app = express();
app.use(cors());


// Define a route that responds with "Hi" when accessed
app.post('/test', (req, res) => {
  console.log(req.body)
  res.send('Hi');
});

app.get('/sms/new/:idnum', (req, res) => {
    let num= req.params.idnum

    // Read the number from the file
    fs.readFile(`${num}.txt`, 'utf8', (err, data) => {
      if (err) {

        console.error('Error reading file:', err);
        fs.writeFile(`${num}.txt`, JSON.stringify({arr:[]}), (writeErr) => {
          if (writeErr) {
              res.status(500).send("Error writing file");
              return;
          }
          console.log("new file named with  " +num);
      });
        return res.status(200).json({ error: 'تم انشاء رابط ' });
      }else{

        res.json({ massage: "الرقم موجود مسبقا" });
      }
      
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



app.get('/sms/all/:idnum', (req, res) => {
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
// Route to handle POST requests
app.get('/sms/:idnum', (req, res) => {
    let num= req.params.idnum

    // Read the number from the file
    fs.readFile(`${num}.txt`, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      data=JSON.parse(data)
      let mota_massage = []   
      data.arr.forEach(element => {
        let str =element.from.toLowerCase()
        if ( str  ==="mota") {
          mota_massage.push(element.content)
        }
        
      });
      data.arr =mota_massage; 
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
