var cryptojs = require('crypto-js');
var Token = require('./models/token');
var User = require('./models/user');
var bcrypt  = require('bcrypt');
var _   = require('underscore');
var cryptojs = require('crypto-js');
var User = require('./models/user');
var Token = require('./models/token');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
dotenv.load();

exports.requireAuthentication = function(req, res, next){
  //Collect token from header or empty if blank
  var token = req.get('Authorization') || '';
  //Find Token in the TB
  Token.findOne(
    {
      tokenHash: cryptojs.MD5(token).toString()
    }
  ).then(function (tokenInstance){
    //If token is blank - throw error
    if(!tokenInstance) {
      throw new Error();
    }
    req.token = tokenInstance.tokenHash;
    return findByToken(token);
  }).then(function (user){
    req.user = user;
    next();
  }).catch(function () {
    res.status(401).send();
  });
};

findByToken = function(token) {
  return new Promise(function(resolve, reject) {
    try {
      //Decode Token
      var decodedJWT = jwt.verify(token, process.env.TOKEN_DECRYPT.toString());
      //Decrypt Data
      var bytes = cryptojs.AES.decrypt(decodedJWT.token, process.env.TOKEN_ENCRYPT.toString());
      //Parse token into JSON
      var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
      User.findById(tokenData.id).then(function (user) {
        //Attempt to find the user
        if (user) {
          resolve(user);
        } else {
          reject();
        }
      }, function (e) {
        console.log(e);
        reject();
      });
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};