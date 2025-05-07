const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const products = {
  1: {
    "id":1,
    "name":"Produto 0",
    "price":5.90,
    "description":"produto 0"
  },
  2: {
    "id":2,
    "name":"Produto 1",
    "price":5.90,
    "description":"produto 1"
  },
  'bdef064f': {
    "id":'bdef064f',
    "name":"Produto 3",
    "price":5.90,
    "description":"produto 3"
  },
};

app.get('/products', (req, res) => res.send(products) );

app.post('/products', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { name, price, description } = req.body;
  
  try {
    await axios.post('http://localhost:4005/events', {
      type: 'ProductCreated',
      data: products[id],
      source: 'products'
    });
    
    products[id] = { id, name, price, description }
    res.status(201).send();
  }
  catch (error) {
    res.status(500).send();
  }


});

app.post('/products/createcart', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { order } = req.body; 
  
  await axios.post('http://localhost:4005/events', {
    type: 'CreateCart',
    data: { id, order },
    source: 'products'
  });
  console.log(id);
  res.status(201).send({id});
});

app.post('/events', async (req, res) => {
  const { id, name, price, description } = req.body.data;  
  products[id] = { id, name, price, description }
  
  await axios.post('http://localhost:4005/events', {
    type: 'ProductCreated',
    data: products[id],
    source: 'products'
  });
  
  res.send(200)
});

app.listen(4000, () => console.log('Products service listening on port 4000'));
