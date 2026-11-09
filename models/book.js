const mongoose = require('mongoose');

var dataSchema=mongoose.Schema({
    name:String,
    author:String,
    price:String,
    image:String
})
module.exports = mongoose.model('book', dataSchema)