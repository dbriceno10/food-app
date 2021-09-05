const express = require('express');
const app = express();

app.get('/', (require, response) => {//El manejador '*' en el get, quiere decir que va a estar manejando absolutamente cualquier ruta que le llegue
  console.log('Hello World');
  response.send({ message: 'Response' });
});

module.exports = app;