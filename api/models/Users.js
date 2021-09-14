const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = mongoose.model(
  'Users',
  new Schema({
    email: String,
    password: String,
    salt: String,//salt es un string que vamos a utilizar para encriptar nuestra contraseña
  })
);

module.exports = Users;
