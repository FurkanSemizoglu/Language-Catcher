

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        minlength: 6,
        trim: true,
    }
}, {timestamps : true});

const User = mongoose.model('User', userSchema ,"usersAuth");

module.exports =  User;
