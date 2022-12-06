const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require('../models');

router.get("/", (req, res) => {
    User.findAll({
    }).then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).json({ msg: "Can't find the users." });
    });
});


router.get("/getuserfromtoken",(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token,process.env.JWT_SECRET)
        res.json({user:userData})
    } catch (error) {
        res.status(500).json({user:false})
    }
})

router.post("api/users/signup", (req, res) => {
    User.create(req.body).then(newUser => {
        const token = jwt.sign({
            id: newUser.id,
            email: newUser.email
        }, process.env.JWT_SECRET, {
            expiresIn: "2h"
        })
        return res.json({
            token,
            user: newUser
        })
    })
})


router.post("/login", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(foundUser => {
        if (!foundUser) {
            return res.status(401).json({ msg: "Your email or password is incorrect!" });
        } else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
            return res.status(401).json({ msg: "Your email or password is incorrect!" });
        } else {
            const token = jwt.sign({
                id: foundUser.id,
                email: foundUser.email
            }, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            return res.json({
                token,
                user: foundUser
            })
        }
    })
})

