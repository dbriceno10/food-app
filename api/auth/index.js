//Va a manejar toda la autenticación
//Un middleware es una función en node que va a recibir request y response pero tambien next(un callback). Cuando llamemos a la función de next va a ejecutar el siguiente middleware
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

const isAuthenticated = (request, response, next) => {
  //Cambiamos a exportar por defecto
  const token = request.header.authorization; //el token se suele sacar dentro de la cabecera autorization, pero podría salir de otro lugar, dependiendo del caso
  if (!token) {
    return response.sendStatus(403);
  }
  jwt.verify(token, 'my-secret', (error, decoded) => {
    const { _id } = decoded;
    Users.findOne({ _id })
      .exec()
      .then((user) => {
        request.user = user;
        next();
      });
  });
};

const hasRole = role => (request, response, next) => {
  if (request.user.role === role) {
    return next();
  }
  response.sendStatus(403);
};

module.exports = {
  isAuthenticated,
  hasRole,
};
