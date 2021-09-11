const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
  response.send('Hola soy orders');
});

module.exports = router;
