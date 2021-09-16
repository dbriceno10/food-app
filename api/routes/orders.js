const express = require('express');
const Orders = require('../models/Orders');
const { isAuthenticated, hasRoles } = require('../auth/index');

const router = express.Router();

router.get('/', (request, response) => {
  Orders.find()
    .exec()
    .then((x) => response.status(200).send(x));
});

router.get('/:id', (request, response) => {
  Orders.findById(request.params.id)
    .exec()
    .then((x) => response.status(200).send(x));
});

router.post('/', isAuthenticated, (request, response) => {
  const { _id } = request.user; //extraemos el id desde los usuarios
  //Cuando creemos una orden, en lugar de estar recibiendo el usuario porla petición, nosotros se lo asignamos aquí mismo en el lado del servidor. Creamos una copia de request.body(...request.body)
  Orders.create({ ...request.body, user_id: _id }).then((x) =>
    response.status(201).send(x)
  );
});

router.put(
  '/:id',
  isAuthenticated,
  hasRoles(['admin', 'user']),
  (request, response) => {
    //hasRoles siempre debe de ir luego de isAuthenticated
    Orders.findByIdAndUpdate(request.params.id, request.body).then(() =>
      response.sendStatus(204)
    );
  }
);

router.delete('/:id', isAuthenticated, (request, response) => {
  Orders.findOneAndDelete(request.params.id)
    .exec()
    .then(() => response.sendStatus(204));
});

module.exports = router;
