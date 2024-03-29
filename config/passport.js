var JwtStrategy = require('passport-jwt').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
//var Token = require('../models/token');
var dotenv = require('dotenv');
dotenv.load();

// load up the user model
var User = require('../models/user');
//var config = require('../config/database'); // get db config file
 
module.exports = function(passport) {
  passport.use(new BearerStrategy(
  function(token, done) {
    Token.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }
));
  // var opts = {};
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  // opts.secretOrKey = process.env.SESSION_SECRET;
  // passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //   User.findOne({id: jwt_payload.id}, function(err, user) {
  //         if (err) {
  //             return done(err, false);
  //         }
  //         if (user) {
  //             done(null, user);
  //         } else {
  //             done(null, false);
  //         }
  //     });
  // }));
};