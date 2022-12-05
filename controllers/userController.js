const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {User} = require('../models');


router.post('/login', (req, res) => {
    User.findOne({
      where:{
        email:req.body.email 
      }
    }).then(foundUser => {
      if(!foundUser){
        return res.status(401).json({msg:"Your email or password is incorrect!"});
      }else if(!bcrypt.compareSync(req.body.password, foundUser.password)){
        return res.status(401).json({msg:"Your email or password is incorrect!" });
      } else {
        const token = jwt.sign({
            id:foundUser.id,
            email:foundUser.email
        },process.env.JWT_SECRET,{
            expiresIn:"2h"
        })
      };
    })
    return res.json({
        token,
        user:foundUser
    })
     
    });

    router.post("api/users/signup", (req,res) => {
        User.create({
          email:req.body.email,
          password:req.body.password,
        }).then(newUser => {  
          req.session.user_id=newUser.id;
          req.session.logged_in=true;
          res.json(newUser);
        }).catch(err => {
          res.status(500).json({msg: "Unable to create an account."});
        });
      });