var cryptojs = require('crypto-js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
//Create token hash
var TokenSchema = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    tokenHash: {
      type: String
    }
});

TokenSchema.pre('save', function (next) {
  var token = this;
  var hash = cryptojs.MD5(token.token).toString();
  token.token = token.token;
  token.tokenHash = hash;
  next();
});

module.exports = mongoose.model('Token', TokenSchema);
