const express = require('express');
const crypto = require('crypto'); //esta libreria es nativa de node
const Users = require('../models/Users');
const router = express.Router();

router.post('/register', (request, response) => {
  const { email, password } = request.body;
  crypto.randomBytes(16, (error, salt) => {
    const newSalt = salt.toString('base64'); //salt viene como un dato tipo buffer, lo convertimos en un string, pasando el argumento base64, esto lo que hará será devolvernos una cadena muy larga
    crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (error, key) => {
      const encryptedPassword = key.toString('base64');
      Users.findOne({ email })
        .exec() //Va a buscar a un usuario por su email, luego ejecuta (exec) la consulta
        .then((user) => {
          if (user) {
            return response.send('Usuario  ya existe');
          }
          Users.create({
            email,
            password: encryptedPassword,
            salt: newsalt,
          }).then(() => {
            response.send('usuario creado con éxito');
          });
        });
    });
  });
});

router.post('/login', (request, response) => {
  response.send('Soy login');
});

module.exports = router;
