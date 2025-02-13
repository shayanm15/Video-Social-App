import mongoose from "mongoose"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../error.js";
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
    
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password: hash});

        await newUser.save();
        res.status(200).send("user has been created");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    
    try {
        // Check to see if username exists in database
       const user = await User.findOne({name:req.body.name});
       if (!user) {
        return next(createError(404, "User not found"));
       }

         // Check to see if password is correct
       const isCorrect = await bcrypt.compare(req.body.password, user.password);
       if (!isCorrect) {
        return next(createError(404, "Wrong credientials"));
       }

       //Code to hide the password from the post request (Return all data from user._doc except password)
       const token = jwt.sign({id:user._id}, process.env.JWT);
       const {password, ...others} = user._doc;

       //Generate cookie
       res.cookie("access_token", token, {
        httpOnly: true
       }).status(200).json(others)


    } catch (error) {
        next(error);
    }
}

export const googleAuth = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(user._doc);
      } else {
        const newUser = new User({
          ...req.body,
          fromGoogle: true,
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(savedUser._doc);
      }
    } catch (err) {
      next(err);
    }
  };