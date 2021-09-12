const express = require('express');
const Orders = require('../models/Orders');
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

router.post('/', (request, response) => {
  Orders.create(request.body).then((x) => response.status(201).send(x));
});

router.put('/:id', (request, response) => {
  Orders.findByIdAndUpdate(request.params.id, request.body).then(() =>
    response.sendStatus(204)
  );
});

router.delete('/:id', (request, response) => {
  Orders.findOneAndDelete(request.params.id)
    .exec()
    .then(() => response.sendStatus(204));
});

module.exports = router;
