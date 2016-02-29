var bcrypt  = require('bcrypt');
var _   = require('underscore');
var cryptojs = require('crypto-js');
var User = require('../models/user');
var Token = require('../models/token');
var jwt = require('jsonwebtoken');
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
  var body = _.pick(req.body, 'email', "password");
  var userInstance;
  //Verify the login information with a custom method
  authenticate(body).then(function(user){
    if(user === 'failed'){
      res.json({success: false, msg: 'Please check email and password.'})
      res.status(401).send();
    }
    var token = generateToken(user, 'authentication');
    if (token){
    userInstance = user;
    //Save Token to DB
    var tokenInstance = new Token({token: token});
    tokenInstance.save(function(err, tokenInstance){
      if (err) {
        return res.json({success: false, msg: 'Failed to create token'});
        res.status(401).send();
      }
    });
    res.status(200).header('Authorization', tokenInstance.token).json(tokenInstance.token);
  } else {
    res.status(401).send();
  }
  });
}

/**
 * GET /
 * User Listing page.
 */
exports.users = function(req, res, next) {
  var token = req.headers.authorization;
  if (token) {
    //var decoded = jwt.decode(token, process.env.SESSION_SECRET);
    User.findById(req.user._id, function(err, user) {
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

authenticate = function(body){
    return new Promise(function(resolve, reject){
    //Verify that information being sent is a string
    if(typeof body.email !== 'string' || typeof body.password !== 'string') {
      return reject();
    }
    //Look up the user
    User.findOne({
        email: body.email
    }).then(function(user){
      //Verify the password is matching
      if (!user || !bcrypt.compareSync(body.password, user.password_hash)) {
        //Authentication Failed
        resolve('failed');
      }
      //Return data is password is matching
      resolve(user);
    }, function (e) {
      reject();
    });
  });
  };

toPublicJSON = function() {
  var json = this.toJSON();
  return _.pick(json,'id', 'email', 'createdAt', 'updatedAt');
};

generateToken = function(user,type){
  if (!_.isString(type)){
    return undefined;
  }

  try {
    //Convert user data to a JSON string
    var stringData = JSON.stringify({id: user._id, type: type});
    var encryptedData = cryptojs.AES.encrypt(stringData, process.env.TOKEN_ENCRYPT.toString()).toString();
    //Create JSON web token
    var token = jwt.sign({
      token: encryptedData
    }, process.env.TOKEN_DECRYPT.toString());
    return token;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

