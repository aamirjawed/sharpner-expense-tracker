
const path = require('path')
const User  = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { resolveSoa } = require('dns')
const { readdirSync } = require('fs')


const sendLoginHTML = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
}

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token =  jwt.sign({id:user.id}, "aamir$jawed$learing$65");
    console.log(token)

    

    
  res.cookie("token", token, {
  httpOnly: true,
  secure: false, // Set to true in production (requires HTTPS)
  sameSite: 'Lax',
  maxAge: 10 * 60 * 1000 // 1 day
});

   res.status(200).json({message:"Login success"})

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};


const sendSignupHTML = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'))
}


const userSignup = async (req, res) => {
  const { name, email, password } = req.body;
  const existingEmail = await User.findOne({where:{email}});

  if(existingEmail){
    return res.status(409).json({message:"This email already exists"})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

 
  try {
   
    const user = await User.create({name:name, email:email, password:hashedPassword})

    if(!user){
      res.status(500).json({message:"Error creating user"})
    }

    res.status(200).json({message:`User with ${name} has been created`})
  } catch (error) {
    console.log("User sign up error:", error);
    res.status(500).json({message:"Server side error while creating user"})
  }
};


const myProfile = async (req, res) => {
    try {
      const user = await User.findByPk(req.userId, {
        attributes:['name']
      })

      if(!user){
        res.status(404).json({message:"User not found"})
        return
      }
      
      res.json({name:user.name})

    } catch (error) {
       res.status(500).json({ message: "Server error" });
    }
}


const getAllUsers = async (req, res) => {
  console.log("you are a premium member")
}

module.exports = {sendLoginHTML, sendSignupHTML, userSignup, userLogin, myProfile, getAllUsers}