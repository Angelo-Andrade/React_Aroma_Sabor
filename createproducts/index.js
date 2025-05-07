const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/productscreate', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { name, price, description } = req.body;
  
  try {
    await axios.post('http://localhost:4005/events', {
      type: 'newProduct',
      data: { id, name, price, description },
      source: 'productscreate'
    });
    
    res.status(201).send();
  }
  catch (error) {
    res.status(500).send();
  }
});

app.post('/events', (req, res) => res.send(200));

app.listen(4004, () => console.log('Products service listening on port 4004'));
