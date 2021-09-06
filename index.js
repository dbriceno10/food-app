const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParsel: true, useUndefinedTopology: true });

const Users = mongoose.model("Users", new mongoose.Schema({ name: String }))

Users.create({ name: 'New String Message' })

app.get('*', (require, response) => {
  //El manejador '*' en el get, quiere decir que va a estar manejando absolutamente cualquier ruta que le llegue
  Users.find()
  .then(x => response.send(x))
});

module.exports = app;