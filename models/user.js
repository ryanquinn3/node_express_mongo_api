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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
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
    if(typeof user.email === 'string') {
        user.email = user.email.toLowerCase();
    }
    if (this.isModified('password') || this.isNew) {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(user.password, salt);
        user.password = hashedPassword;
        user.salt = salt;
        user.password_hash = hashedPassword;
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);