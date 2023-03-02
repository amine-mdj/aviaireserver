const User = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const login = async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    // Check if username and password is provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      })
    }
    try {
      const user2 = await User.findOne({ email: email })
      const accesstoken = jwt.sign({id: user2._id, role:user2.role}, process.env.ACCESS_TOKEN_SECRET )
      if (!user2) {
        res.status(400).json({
          message: "Login not successful",
          error: "User not found",
        })
      } else {
        // comparing given password with hashed password
        bcrypt.compare(password, user2.password).then(function (result) {
          result
            ? res.status(200).json({
                message: "Login successful",
                // user2: user2,
                accesstoken: accesstoken
              })
            : res.status(400).json({ message: "Login not succesful" })
        })
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      })
    }
}

const register = async(req,res)=>{
    const  hashedPass = await bcrypt.hash(req.body.password,10)
    const user =  User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass
      
    });
    user
    .save()
    .then((res) => {
      console.log("user is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
    
    res.send('user is saved')
}

module.exports = {
    login,
    register
}