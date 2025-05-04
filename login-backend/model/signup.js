const mongoose = require('mongoose');

var schema=mongoose.Schema({
    email:String,
    username:String,
    password:String
})
var ContactModel=mongoose.model("signup",schema)
module.exports=ContactModel