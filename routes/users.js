var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var passport = require('passport');
var middleware  = require('../middleware.js');

router.get('/', middleware.requireAuthentication, userController.users);
router.post('/signup', userController.signup);
router.delete('/signout', middleware.requireAuthentication, userController.signout);
router.post('/auth', userController.auth);


module.exports = router;
