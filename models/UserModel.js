const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});


userSchema.plugin(passportLocalMongoose);

/*userSchema.methods.authenticate = function(password) {      
    return this.password === password;
}*/

module.exports = mongoose.model('User',userSchema);