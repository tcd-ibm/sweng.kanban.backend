const mongoose = require('mongoose');

// create an schema
var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email:String
});

var userModel=mongoose.model('Users',userSchema);

module.exports = mongoose.model("Users", userModel);