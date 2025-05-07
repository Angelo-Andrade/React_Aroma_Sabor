const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const services = {
    products: 'http://localhost:4000/events',
    cart: 'http://localhost:4001/events',
    purchases: 'http://localhost:4002/events',
    produductscreate: 'http://localhost:4004/events'
};

app.post('/events', async (req, res) => {
    const { type, data, source } = req.body;
    console.log('Event recebido:', type, 'de', source);

    for (let [name, url] of Object.entries(services)) {
        if (name === source) continue;
        
        try { await axios.post(url, { type, data }); }
        
        catch (err) { console.error(`Erro ao enviar para ${name}: ${err.message}`); }
    }

    res.send(200);
});
  

app.listen(4005, () => {
  console.log('Event Bus service on 4005');
});
