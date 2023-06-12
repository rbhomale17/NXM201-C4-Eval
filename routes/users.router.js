const express = require('express');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv').config()
const saltRounds = +process.env.saltRound;
const jwt = require('jsonwebtoken')
const privateKey = process.env.privateKey;
const redis = require('redis');
const client = redis.createClient();

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;
    // console.log(email,password)
    try {
        if (!email || !password) res.send({ msg: "Please Provide Correct Details." })
        else {
            let IsUserPresent = await UserModel.findOne({ email });
            if (IsUserPresent) res.send({ msg: "User Already Exists, Please Try Log in." })
            else {
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                    // Store hash in your password DB.
                    if (err) {
                        console.log(err);
                        return;
                    }
                    req.body.password = hash;
                    let saveUser = new UserModel({ ...req.body });
                    await saveUser.save();
                    res.send({ msg: "User registration succesfull" })
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.send({ err: error.message });
    }
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // console.log(email,password)
    try {
        if (!email || !password) res.send({ msg: "Please Provide Correct Details." })
        else {
            let IsUserPresent = await UserModel.findOne({ email });
            if (!IsUserPresent) res.send({ msg: "User Not Found, Please Try Sign-up." })
            else {
                bcrypt.compare(password, IsUserPresent.password, async function (err, result) {
                    // Store hash in your password DB.
                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (result) {
                        var token = jwt.sign({ userID: IsUserPresent._id, email: IsUserPresent.email },
                            privateKey,
                            { expiresIn: '4h' }
                        );
                        res.send({ msg: "Log-in is Successfull", token })
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.send({ err: error.message });
    }
});

userRouter.post('/logout', async (req, res) => {
    const token = req.headers?.authorization?.split(' ')?.[1];
    if (token) {
        try {
            await client.connect();
            await client.set('token', token,{
                EX:1800
            })
            res.send({msg:'Looged Out Successfull.', 'Is_Token_Blacklisted':true})
        } catch (error) {
            console.log(error);
            res.send({err:error.message})
        }
    }
})
module.exports = userRouter;