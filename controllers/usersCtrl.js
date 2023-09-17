import User from "../model/user.js"
import asyncHandler from "express-async-handler"
import bcrypt from "bcryptjs"
import generateToken from '../utils/generateToken.js';
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const registerUserCtrl = asyncHandler(async(req,res)=>{
    const {fullname, email, password} = req.body
    const userexists =await User.findOne({email})

    if(userexists){
      throw new Error("User already exists")
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({fullname, email, password:hashedPassword})
    res.status(201).json({error:false, msg:"User registered successfully", data:user})
})

export const loginUserCtrl = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    const userFound = await User.findOne({email})
    if(!userFound){
        throw new Error("Invalid email-Id")
    }
    const salt = await bcrypt.compare(password, userFound.password)
    if(salt){
        return res.json({error:false, msg:"LogedIn Successfully", data:userFound, Token:generateToken(userFound.id)})
    }
    else{
        throw new Error("Invalid Password")
    }
})

export const getUserCtrl = asyncHandler(async(req, res)=>{
    const token = getTokenFromHeader(req)

    const verified = verifyToken(token)
    console.log(verified) 

    // console.log(token)
    res.json({msg:"Welcome to getting user API"})
})

export const updateShippingAddresctrl = asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
          country,
        },
        hasShippingAddress: true,
      },
      {
        new: true,
      }
    );
    //send response
    res.json({
      status: "success",
      message: "User shipping address updated successfully",
      user,
    });
  });