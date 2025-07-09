
const path = require('path')
const User  = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Expense = require('../model/expenseModel')
const sendEmail = require('../services/node-mail')
const { router } = require('../routes/expenseRoutes')
const ForgotPassword = require('../model/forgotPasswordModel')
const { v4: uuidv4 } = require('uuid');


const sendLoginHTML = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
}

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if(email === undefined || password === undefined ){
    res.status(400).json({message:"All fields are required"})
  }

  try {
    const user = await User.findOne({ where: { email } }, );

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


const premiumOrNot = async(req, res) => {
  
      if(req.isPremium === "Yes"){
        return res.json({
          
          message:"yes" 
        })
      }else{
        return res.json({message:"no"})
      }
  
}


// forgot password

const forgotPasswordPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../public/forgotpassword.html'))
}





const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();
   

    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = uuidv4();

    await ForgotPassword.create({
      id: resetToken,
      userId: user.id,
      
    });

    const resetLink = `http://localhost:5000/user/password/reset-password/${resetToken}`;

    await sendEmail(normalizedEmail, resetLink);

    return res.status(200).json({ message: 'Reset link sent successfully' });
  } catch (error) {
    console.error('Error in forgot password:', error.message);
    return res.status(500).json({ message: 'Error in sending reset link' });
  }
};



// reset password



const resetPasswordPage = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await ForgotPassword.findByPk(id);

    // If token is valid and active, show reset password page
    if (request && request.isActive === true) {
      return res.sendFile(path.join(__dirname, '../public/resetpassword.html'));
    }

    // If token is invalid or inactive, redirect to forgot password page
    return res.redirect('/forgot-password');
  } catch (error) {
    console.error('Error loading reset password page:', error.message);
    return res.status(500).send('Internal Server Error');
  }
};


const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;

  try {
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const resetRequest = await ForgotPassword.findByPk(id);

    if (!resetRequest || resetRequest.isActive !== true) {
      return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }

    const user = await User.findByPk(resetRequest.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    resetRequest.isActive = false;
    await resetRequest.save();

    
    return res.status(200).json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error('Error resetting password:', error.message);
    return res.status(500).send('Something went wrong. Please try again later.');
  }
};






module.exports = {
  sendLoginHTML, sendSignupHTML, userSignup, userLogin, myProfile, premiumOrNot, forgotPasswordPage, forgotPassword,
  resetPasswordPage,
  resetPassword
}