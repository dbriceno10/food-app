const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
//Vamos a crear un nuevo endpoint que le va a permitir al usuario poder obtener los datos de el mismo.
const { isAuthenticated } = require('../auth'); //En este caso no necesitamos indicar el archivo index en el que se encuentra alojado

const router = express.Router();

const signToken = (_id) => {
  return jwt.sign({ _id }, 'my-secret', {
    expiresIn: 60 * 60 * 24 * 365, //esto es un objeto de configuración, se encarga de dar el tiempo de duración del token segundos * minutos * horas * dias
  });
};

router.post('/register', (request, response) => {
  const { username, email, password } = request.body;
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
            username,
            email,
            password: encryptedPassword,
            salt: newSalt,
          }).then(() => {
            response.send('usuario creado con éxito');
          });
        });
    });
  });
});

router.post('/login', (request, response) => {
  const { email, password } = request.body;
  Users.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return response.send('usuario y/o contraseña incorrencta');
      }
      crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (error, key) => {
        const encryptedPassword = key.toString('base64');
        if (user.password === encryptedPassword) {
          const token = signToken(user._id); //"firma el token", toma ese id y lo encripta
          return response.send({ token });
        }
        response.send('usuario y/o contraseña incorrecta');
      });
    });
});

router.get('/me', isAuthenticated, (request, response) => {
  response.send(request.user); //Esto va a enviar el usuario completo
});

module.exports = router;
