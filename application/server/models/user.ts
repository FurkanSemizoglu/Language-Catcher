

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id : {
        type : Number,
        required : true,
        unique : true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    }
}, {timestamps : true});

const User = mongoose.model('User', userSchema ,"usersAuth");

module.exports =  User;
