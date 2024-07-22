const User = require('../models/user');
/* const Request = require('express');
const Response = require('express'); */
import { Request , Response  } from 'express';
const registerUser = async (req : Request, res : Response) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

const loginUser = async (req : Request, res : Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

const logoutUser = async (req: Request, res  : Response) => {
    try {
        
      
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
};

const getUser = async (req: Request, res  : Response) => {
    
    res.send(req);
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
};
