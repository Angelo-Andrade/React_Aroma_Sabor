const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const cart = {
    1:{
        "id":1,
        "order": {
            "1": {
                "productId":"1",
                "productName":"Produto 1",
                "amount":1,
                "productPrice": 5.90
            },
            "2": {
                "productId":"2",
                "productName":"Produto 2",
                "amount":2,
                "productPrice": 5.90
            }
        }
    },
}

app.post('/cart', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { order } = req.body; 

    cart[id] = { id, order };

    await axios.post('http://localhost:4005/events', {
        type: 'CartUpdated',
        data: { id, order },
        source: 'cart'
    });

    res.status(201).send({id, order});
});

app.delete('/cart', async (req, res) => {
    const {id, productId} = req.body;
    delete cart[id].order[productId];
    
    await axios.post('http://localhost:4005/events', {
        type: 'ItemRemoved',
        data: cart[id],
        source: 'cart'
    });

    res.status(201).send(cart[id]);
});

app.post('/cart/finalize', async (req, res) => {
    const { id, order } = req.body.cart;

    await axios.post('http://localhost:4005/events', {
        type: 'CartFinalized',
        data: { id, order },
        source: 'cart'
    });
    
    res.send(201, { status: 'Compra enviada para finalização' });
});

app.get('/cart/:id', (req, res) => {
    const { id } = req.params;
    
    if (cart[id]) res.json(cart[id]);
    
    else res.status(201).json({ message: "Carrinho não encontrado" });
});


app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log('recebido')

    if (type === 'CreateCart') {
        const { id, order } = data; 
        console.log(id);
        cart[id] = { id, order };
    }
    
    if (type === 'PurchaseMade') {
        const { id } = data;
        delete cart[id];
    }
  
    res.status(200).send();
});
  

app.listen(4001, () => console.log('Cart service listening on port 4001'));