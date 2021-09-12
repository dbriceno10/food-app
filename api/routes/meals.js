const express = require('express');
const Meals = require('../models/Meals');
const router = express.Router();

router.get('/', (request, response) => {
  Meals.find()
    .exec()
    .then((x) => response.status(200).send(x)); //Va a buscar absolutamente todo, va a devolver un query, exec() va a devolver un documento query con todo lo que encontró
  // response.send('Hola soy meals');
});

router.get('/:id', (request, response) => {
  Meals.findById(request.params.id)
    .exec()
    .then((x) => response.status(200).send(x)); //Va a buscar por id el query y lo va a devolver, si es que lo encontró
});

router.post('/', (request, response) => {
  Meals.create(request.body).then((x) => response.status(201).send(x));
});

router.put('/:id', (request, response) => {
  Meals.findByIdAndUpdate(request.body.id, request.body).then((x) =>
    response.status(204).send(x)
  );
});

router.delete('/:id', (request, response) => {
  Meals.findOneAndDelete(request.params.id)
    .exec()
    .then(() => response.sendStatus(204));
});
//Ni put ni delete tienen estrictamente que devolver algún elemento, sin embargo para manejar más comodamente la información vamos a devolver el status
module.exports = router;
