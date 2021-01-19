const express = require('express');

const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/signup', UserController.signupUser);

router.post('/login', UserController.loginUser);

module.exports = router;
