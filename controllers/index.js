const express = require('express');
const router = express.Router();
const userRoutes = require("./userController")
const huntRoutes = require("./huntController")
const pokemonRoutes = require("./pokemonController")
const jwt =require("jsonwebtoken")



router.get("/token",(req,res)=>{
    const token = jwt.sign({
        name:"ash",
        hunts:"2"
    },process.env.JWT_SECRET,{
        expiresIn:"2h"
    })
    res.json({
        token
    })
})

router.get("/readtoken",(req,res)=>{
    const token =req.headers.authorization.split(" ")[1];
    try{

        const tokenData = jwt.verify(token,process.env.JWT_SECRET)
        console.log(tokenData)
    } catch(err){
        console.log("error")
        console.log(err);
        res.status(500).json({msg:"error occurred!",err})
    }
    res.send("Check the logs")
})

router.use("/api/users",userRoutes)
router.use("/api/hunts", huntRoutes)
router.use("/api/pokemon", pokemonRoutes)

module.exports= router