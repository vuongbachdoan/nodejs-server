const mongoose = require('mongoose')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var dotenv = require('dotenv')
const bcryptHandle = require('../entities/bcrypt')
dotenv.config()
const secretKey = process.env.SECRET_KEY;

const jwtSign = (payload) => {
    return jwt.sign(
        payload,
        secretKey,
        {
            expiresIn: '1h',
            algorithm: 'HS256'
        }
    )
}

const jwtVerifier = (token) => {
    return jwt.verify(
        token,
        secretKey,
        {
            algorithms: ['HS256']
        }
    )
}

const UserController = {
    signUp: async (req, res) => {
        try {
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                username: req.body.username,
                email: req.body.email,
                password: await bcryptHandle.hashPassword(req.body.password),
            })
            let savedUser = await user.save();

            const token = jwtSign(
                {
                    username: savedUser.username,
                    email: savedUser.email,
                },
                secretKey,
                {
                    expiresIn: '1h',
                    algorithm: 'HS256'
                }
            )


            return res.status(201).json({
                success: true,
                message: 'User saved successfully',
                token: token
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Can not save user',
                error: err.message
            })
        }
    },
    signIn: async (req, res) => {
        try {
            const token =  req.headers.token
            const data = jwtVerifier(token)

            if(bcryptHandle.comparePassword(req.body.password, data.password)){
                return res.status(200).json({
                    success: true,
                    message: 'User logged in successfully',
                    data: data
                })
            } else{
                return res.status(401).json({
                    success: false,
                    message: 'Wrong password'
                })
            }
            
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                error: err.message
            })
        }
    }
}

module.exports = UserController
