
import jwt from "jsonwebtoken";
import { Users } from "../models/user.model.js";

export const isAuthenticate = async (req, res , next) => {
    try {
        const token = req.cookies.token || req.headers.token;
        // console.log( ' token' , token);
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "user not authenticated , please login first !",
            });
        } else {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById( decode._id , "-password");
            // console.info("not error");
            next();
        }

    } catch (error) {
       return  res.status(400).json({
            message: "user not authenticate",
            error
        });
    }
}

export const isAdmin =(req , res , next)=>{

        const {role} = req.user
        console.log(role);
        if(role === 'admin'){
            console.log("admin ok");
            next();
        }
        else{
            console.log("admin not");
            res.status(400).json({
                message:"only admin can be chenge this section",
            })
        }
     
}

export const isOwnerOrDriver =(req , res , next)=>{

        const {role} = req.user
        console.log(role);
        if(role === 'owner'||role === 'driver' ){
            console.log("owmer or driver");
            next();
        }
        else{
            console.log("admin not");
            res.status(400).json({
                message:"only owner or driver can be chenge this section",
            })
        }
     
}