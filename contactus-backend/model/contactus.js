const mongoose = require('mongoose');

var schema=mongoose.Schema({
    name:String,
    email:String,
    message:String
})
var ContactModel=mongoose.model("contact",schema)
module.exports=ContactModel