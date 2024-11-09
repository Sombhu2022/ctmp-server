
import bcrypt from 'bcrypt'
import { sendCookie } from "../utils/sendCookie.js";
import { sendEmail } from "../utils/sendMail.js";
import { genarate6DigitOtp } from "../utils/OtpGenarate.js";
import { timeExpire } from "../utils/timeExpire.js";
import { Users } from '../models/user.model.js';
import { fileDestroy, fileUploader } from '../utils/fileUpload.js';


export const createUser = async (req, res) => {

    try {
        const { name, password, email, role } = req.body
        console.log(req.body);

        if (!name || !password || !email) {
            return res.status(400).json({
                message: "something error , please try again !",
                success: false
            })
        }
        if(password.length < 8){
            return res.status(400).json({
                message: "Password must be 8 character or more !",
                success: false
            })
        }

        let user = await Users.findOne({ email })
        // console.log("user=>", user);
        if (user) {
            console.info("user exist");
            return res.status(400).json({ message: "email alrady exist" , success:false })
        }

        user = await Users.create({ name, email, password, role })
        sendCookie(user, res, "user created successfull", 200)
        sendEmail(user.email, `wellcome ${user.name}`, "Thank you for choosing <strong>Vraman Sathi Pvt. Ltd.</strong> as your transportation management platform. We're dedicated to providing you with the best centralized transportation solutions to make your journey smooth and efficient.")

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            message: "somthing error , please try again !",
            success: false,
            error
        })

    }
}


export const sendOtpForVerifyAccount = async (req, res) => {
    try {
        // Authenticate user and retrieve email
        const { id } = req.user;
        const { email } = req.body 
        const user = await Users.findById(id);

        if (!user) {
            return res.status(400).json({
                message: "User not authenticated!",
                success: false,
            });
        }

        // Generate OTP
        const otp = genarate6DigitOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // Set OTP expiry for 10 minutes

        // Send OTP email
        await sendEmail(email, "Verify Account - OTP", otp);

        // Save OTP and expiry in user record
        user.otp = otp;
        user.otpExpiary = otpExpiry;
        await user.save();

        return res.status(200).json({
            message: "OTP sent successfully to verify your account.",
            success: true,
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            message: "Something went wrong, please try again!",
            success: false,
        });
    }
};



export const VerifyOtpWithExpiry = async(req , res)=>{
    try {
       
        const { otp } = req.body 

        let user = await Users.findOne({otp: otp , otpExpiary:{$gt:Date.now()}})

        user.otp = null
        user.otpExpiary = null 

        if(!user){
            await user.save()
            return res.status(400).json({message:'Invalid OTP ! , please verify request again'})
        } else{
            user.isVerify = true
        }
      
        await user.save()
    
        return res.status(200).json({
            message:"otp verify successfully",
            success:true ,
            user
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message:"something error , please try again !",
            success:false
        })
    }
}



export const getUser = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await Users.findById({ _id: id });
        res.status(200).json({
            message: "user fetched",
            data:user,
        });
    } catch (error) {
        res.status(400).json({
            message: "somthing error",
            error,
        });
    }
};


export const changeProfilePic = async(req , res)=>{
    try {
        // file path 
        const { file } = req.body
        const { id } = req.user 

        // file check 
        if(!file){
            return res.status(400).json({
                message:"file is required !" ,
                success:false
            })
        }

        // user fetching 
        let user = await Users.findById(id)

        if(!user){
            return res.status(400).json({message:'user not authenticate !'})
        }

        // delete previous file 
        const file_id = user.profile_pic?.public_id
        const isDistroy = await fileDestroy(file_id)

        if(!isDistroy && file_id){
            return res.status(400).json({
                message:"previous file not deleted ! , please try again ",
                success:false
            })
        }

        // new file upload 
        const { url , public_id , error } = await fileUploader(file)

        if(error){
            return res.status(400).json({
                message:"file not upload !" ,
                success:false
            })
        }

        user.profile_pic.url = url 
        user.profile_pic.public_id = public_id

        await user.save()

        return res.status(200).json({
            message:"profile pic update success !",
            success:true ,
            data:user
        })

    } catch (error) {
        res.status(400).json({
            message: "somthing error",
            error,
        });
    }
} 


export const logInUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await Users.findOne({
            email
        })
        .select('+password')

        if (!user) return res.status(400).json({
            message: "email or password not match"
        })
        console.log(user);
        console.log(password);
        const isMatch = await user.comparePassword(password)
        console.log(isMatch);

        if (!isMatch) return res.status(400).json({
            message: "email or password not match"
        })
        sendCookie(user, res, " login successfull", 200)

    } catch (error) {
        res.status(400).json({
            message: "somthing error , please try again !",
            error
        })
    }
}

export const logOutUser = (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", "" , {
                  expires: new Date(Date.now()),
                  httpOnly: true,
            })
            .json({
                success: true,
                message: "Logout successfull",
            });

    } catch (error) {
        res.json({
            success: false,
            message: error,
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await Users.findByIdAndDelete({ id })

        res
            .status(200)
            .cookie("token", "", {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            .json({
                success: true,
                message: "user deleted",
            });

    } catch (error) {
        res.status(400).json({
            message: 'user not delete',
            success: false,
            error
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = Users.findByIdAndUpdate({ id }, req.body, { new: true })
        res.status(200).json({
            message: "update user",
            success: true,
            user
        })
    } catch (error) {
        res.status(400).json({
            message: 'user not update',
            success: false,
            error
        })

    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    console.log(req.body);
    try {
        let user = await Users.findOne({ email })
        console.log(user);
        if (!user) return res.status(400).json({
            success: false,
            message: 'user not found'
        });
        const otp = genarate6DigitOtp()
        console.log(otp);
        sendEmail(email, 'OTP for forgot password', `this is your Otp ${otp} , not shear anywhere`)

        user.otp = otp;
        user.expireAt = Date.now() + 5 * 60 * 1000;
        await user.save({ validateBeforeSave: false })

        res.status(200).json({
            user,
            message: 'otp send successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({

            message: "somthing error"
        })
    }
}




export const changePassWithOtp = async (req, res) => {
    try {
        const { otp, password } = req.body

        console.log(req.body, typeof (otp));
        const user = await Users.findOne({ otp }).select('+password')
        // console.log(user);
        const isOtpExpire = timeExpire(user.expireAt);
        if (isOtpExpire) {
            user.otp = null;
            user.otpExpiary = null;
            await user.save({ validateBeforeSave: false })
            return res.status(400).json({
                message: "otp is expired"
            })
        }


        console.log(user);
        if (!user) return res.status(400).json({
            message: 'otp not corrct'
        });

        user.password = password;
        user.otp = null
        await user.save({ validateBeforeSave: false })

        res.status(200).json({
            user,
            message: 'password changed'
        })
    } catch (error) {
        res.status(400).json({
            message: "error"
        })
    }
}



export const ChangePasswordWithOldPassword = async (req, res) => {

    const { id } = req.user
    const { oldPassword, newPassword } = req.body
    console.log("log password", oldPassword);
    try {
        const user = await Users.findById(id).select("+password")
        const isMatch = await user.comparePassword(oldPassword)

        if (!isMatch) return res.status(400).json({
            message: " password not match"
        })

        user.password = newPassword;
        await user.save({ validateBeforeSave: false })

        // res.status(200).json({ success:true , message:"password change successfully", user })
        sendCookie(user, res, " password chang successfully", 200)

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "password not change", error })

    }

}