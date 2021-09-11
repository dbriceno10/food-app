const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('*', (require, response) => {
  //El manejador '*' en el get, quiere decir que va a estar manejando absolutamente cualquier ruta que le llegue
  response.send('Hola Mundo, con base de datos');
});

module.exports = app;
