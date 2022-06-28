const express = require("express")
const router = express.Router()
const User = require("../models/user")

router.post("/login", async (req, res, next) => {
    try{
        // takes the user email and password and attempt to authenticate them
    }catch(err){
        next(err)
    }
})

router.post("/register", async (req, res, next) => {
    try{
        // takes the user email and password and create a new user in our database
    }catch(err){
        next(err)
    }
})

module.exports = router