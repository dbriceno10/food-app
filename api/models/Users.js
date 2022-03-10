const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = mongoose.model(
  'Users',
  new Schema({
    username: String,
    email: String,
    password: String,
    salt: String, //salt es un string que vamos a utilizar para encriptar nuestra contraseña
    role: { type: String, default: 'user' },//podría ser también un admin, por ejemplo
    date: { type: Date, default: Date.now },
  })
);

module.exports = Users;
