var passport = require('passport');
require('../config/passport')(passport);
var User = require('../models/user');
var jwt = require('jwt-simple');
var dotenv = require('dotenv');
dotenv.load();

// Sign up a user
exports.signup = function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please provide a valid email and password.'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Email already exists. Please try again'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
}

exports.auth = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, process.env.SESSION_SECRET);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
}

/**
 * GET /
 * User Listing page.
 */
exports.users = function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, process.env.SESSION_SECRET);
    User.findOne({
      email: decoded.email
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'You are logged in ' + user.email + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
};

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

