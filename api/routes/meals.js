const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
  response.send('Hola soy meals');
});

router.get('/:id', (request, response) => {
  response.send(request.params.id);
});

router.post('/', (request, response) => {
  // request.body;
  response.send('soy post');
});

router.put('/:id', (request, response) => {
  response.send('soy put');
});

router.delete('/:id', (request, response) => {
  response.send('soy delete');
});

module.exports = router;
