const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const meals = require('./routes/meals');
const orders = require('./routes/orders');
const auth = require('./routes/auth');

const app = express();
app.use(bodyParser.json()); //Indicamos que use body-parser, va a tomar lo que enviemos al bory y lo va a convertir en json
app.use(cors());//Esto nos va a permitir acceder a nuestra aplicación de manera fácil desde cualquier entorno fuera de localhost

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/meals', meals);
app.use('/api/orders', orders);
app.use('/api/auth', auth);

module.exports = app;
