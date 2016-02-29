var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var passport = require('passport');
var middleware  = require('../middleware.js');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', middleware.requireAuthentication, userController.users);
router.post('/signup', userController.signup);
// router.post('/signout', userController.signout);
router.post('/auth', userController.auth);


module.exports = router;
