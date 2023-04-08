const User = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:process.env.EMAIL,
      pass:process.env.PASSWORD,
  }
}) 

const sendpasswordlink = async (req,res) =>{
  const {email} = req.body;
  if(!email){
    res.status(401).json({status:401,message:"Enter Your Email"})
}
try {
  const userfind = await User.findOne({email:email});
  const token = jwt.sign({id:userfind._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1200s"});
  const mailOptions = {
    from:process.env.EMAIL,
    to:email,
    subject:"Sending Email For password Reset",
    text:`This Link Valid For 20 MINUTES ${process.env.CLIENT_URL}/resetpassword/${userfind._id}/${token}`
}

  transporter.sendMail(mailOptions,(error,info)=>{
  if(error){
    console.log("error",error);
      res.status(401).json({status:401,message:"email not send"})
  }else{
      res.status(201).json({status:201,message:"pasword reset link send Succsfully in Your Email"})
  }
})

} catch (error) {
  res.status(401).json({status:401,message:"invalid user"})
}

}


const forgotpassword = async(req, res) =>{
  const {id,token} = req.params;
  const {password} = req.body;

  try {
    const validuser = await User.findOne({_id:id});
    const verifyToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(validuser && verifyToken.id){
        const newpassword = await bcrypt.hash(password,12);
        const setnewuserpass = await User.findOneAndUpdate({_id:id},{password:newpassword});
        setnewuserpass.save();
        res.status(201).json({message:"Password Succesfulyy Update"})
    }else{
        res.status(401).json({status:401,message:"user not exist"})
    }
} catch (error) {
    res.status(401).json({status:401,message:'error has occured'})
}
}



const refresh = (req,res)=>{
   console.log('reached')
   const token = req.cookies.jwt;
   const decoded = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
   if(decoded){
    const accesstoken = jwt.sign({id:decoded.id,role:decoded.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '30s'},)
    const refreshtoken = jwt.sign({id:decoded.id,role:decoded.role},process.env.REFRESH_TOKEN_SECRET,{expiresIn: '1d'})
    res.cookie('jwt',refreshtoken, { httpOnly:true, sameSite:'none', secure:true, maxAge:1000 * 60 * 60 * 24 })
    res.json({accesstoken:accesstoken})

   }
}

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
      const accesstoken = jwt.sign({id: user2._id, role:user2.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '30s'} )
      const refreshtoken = jwt.sign({id: user2._id, role:user2.role}, process.env.REFRESH_TOKEN_SECRET,{expiresIn: '1d'} )
      if (!user2) {
        res.status(400).json({
          message: "Login not successful",
          error: "email introuvable! créer un compte",
        })
      } else {
        // comparing given password with hashed password
        bcrypt.compare(password, user2.password).then(function (result) {
          if (result)
            {res.cookie('jwt',refreshtoken, { httpOnly:true, sameSite:'none', secure:true, maxAge:1000 * 60 * 60 * 24 })
              res.status(200).json({
                message: "Login successful",
                // user2: user2,
                accesstoken: accesstoken
              })
              }

          else res.status(400).json({ message: "mot de pass incorrect" })
        })
      }
    } catch (error) {
      res.status(400).json({
        // message: "An error occurred",
        message: "email introuvable ! créer un compte",
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
    register,
    refresh,
    sendpasswordlink,
    forgotpassword
}