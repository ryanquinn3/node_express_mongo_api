var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var passport = require('passport');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', passport.authenticate('jwt', { session: false}), userController.users);
router.post('/signup', userController.signup);
router.post('/auth', userController.auth);

module.exports = router;
