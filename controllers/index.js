const express = require('express');
const router = express.Router();
const userRoutes = require("./userController")
const huntRoutes = require("./huntController")
const pokemonRoutes = require("./pokemonController")
const jwt =require("jsonwebtoken")

router.get("/",(req,res)=>{
    res.send(
        `
        <h1> This is the homepage for Professor Oak's Shiny Dex server. </h1>
        
        <h3>For all users use https://shiny-hunter-server.herokuapp.com/api/users</h3>
        
        <h3>For all hunts use https://shiny-hunter-server.herokuapp.com/api/hunts</h3> 

        <h3>For all pokemon use https://shiny-hunter-server.herokuapp.com/api/pokemon</h3>

        <h3>For a single user, hunt or pokemon add /id to the respective url.</h3>
        `)
})
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