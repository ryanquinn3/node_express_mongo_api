var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    //Add random char to end of hash
    salt: {
        type: String
    },
    password_hash: {
        type: String
    }
});
 
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(user.password, salt);
        user.password = hashedPassword;
        user.salt = salt;
        user.password_hash = hashedPassword;
        next();
    //     bcrypt.genSalt(10, function (err, salt) {
    //         if (err) {
    //             return next(err);
    //         }
    //         bcrypt.hash(user.password, salt, function (err, hash) {
    //             if (err) {
    //                 return next(err);
    //             }
    //             user.password = hash;
    //             next();
    //         });
    //     });
    // } else {
    //     return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('User', UserSchema);