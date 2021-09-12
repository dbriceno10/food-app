const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const meals = require('./routes/meals');
const orders = require('./routes/orders');
const app = express();
app.use(bodyParser.json()); //Indicamos que use body-parser, va a tomar lo que enviemos al bory y lo va a convertir en json
app.use(cors());//Esto nos va a permitir acceder a nuestra aplicación de manera fácil desde cualquier entorno fuera de localhost

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/meals', meals);
app.use('/api/orders', orders);

// app.get('*', (request, response) => {
//   //El manejador '*' en el get, quiere decir que va a estar manejando absolutamente cualquier ruta que le llegue
//   response.send('Hola Mundo, con base de datos');
// });

module.exports = app;
