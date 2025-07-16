import { generateToken } from "../lib/utils.js";
import User from "../modals/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { response } from "express";
import jwt from "jsonwebtoken";

// signup user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;

    try {
            console.log("Received signup request:", req.body); // ✅ Log incoming data
        if(!fullName || !email || !password || !bio){
            return res.json({success:false, message: "Missing Details"})
        }
        const user = await User.findOne({email});

        if(user){
             return res.json({success:false, message: "Account already exists"})

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({
            success:true,
            userData: newUser,
            token,
            message:"Account created successfully"
        })
    } catch (error) {
          console.error("Signup error:", error); // ✅ Detailed error logging
        console.log(error.message);
        res.json({
            success:false,
            message:"Account creation failed"
        })
    }
}



// controller to login

export const login = async (req,res) =>{
    try {
        const {email,password} = req.body;
        const userData = await User.findOne({email})
  if (!userData) {
            return res.json({
                success: false,
                message: "User not found. Please signup first."
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({
                success: false, 
                message:"Invalid Credential"
            });
        }
          const token = generateToken(userData._id)

          res.json({success:true,
            userData,token,
            message:"Login successfully"
          })

        
    } catch (error) {
         console.log(error.message);
        res.json({
            success:false,
            message:"Login failed"
        })
    }
}


// controller to check if user is authenticated

export const checkAuth = (req, res)=>{
    res.json({success:true,
        user: req.user
    });

}


// function to update user profile derails

export const updateProfile = async (req, res)=>{
    try {
        const {profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId, {bio, fullName}, {new :true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic : upload.secure_url, bio,fullName}, {new: true});

        }

        res.json({success:true, user:updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}