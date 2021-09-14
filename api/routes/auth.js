const express = require('express');
const Users = require("../models/Users")
const router = express.Router();

router.post('/register', (request, response) => {
  response.send("Soy registro")
});

router.post('/login', (request, response) => {
  response.send("Soy login")
});

module.exports = router;
