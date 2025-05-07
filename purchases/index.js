const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let purchases = {};

app.get('/purchases', (req, res) => {
    console.log(purchases);
    res.send(purchases);
});

app.post('/purchases', (req, res) => {
    const date = new Date();
    const { id, order } = req.body.cart;
    const newPurchase = { id, order, "date":date }
    purchases = { ...purchases, [id]: newPurchase }
    res.send(200);
});

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    const date = new Date();

    if (type === 'CartFinalized') {
        const { id, order } = data;
        const newPurchase = { id, order, "date":date }
        console.log("novo: ",newPurchase);
        purchases = { ...purchases, [id]: newPurchase }
    
        await axios.post('http://localhost:4005/events', {
            type: 'PurchaseMade',
            data: newPurchase,
            source: 'purchases'
        });
    }
  
    res.send(200);
});

app.listen(4002, () => console.log('Purchase service listening on port 4002'));