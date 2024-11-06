import mongoose, { model, Schema } from "mongoose";
import bcrypt from 'bcrypt'

// table stracture 
const userSchema = new Schema({

    name: {
        type: String,
        maxLength: [60, 'name should be in 60 latter'],
        required: [true, 'name is reqired!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is reqired!'],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please provide a valid email address'
        ],
        trim: true
    },
    password: {
        type: String,
        minLength: [8, 'password must be 8 charecter or above'],
        required: [true, 'password is reqired!'],
        select: false
    },
    profile_pic: {
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dab0ekhmy/image/upload/v1728130610/thik-ai/gvjpvq3xljmnw2vwdkag.avif'
        },
        public_id: {
            type: String,
            default: null
        }
    }
    ,
    role: {
        type: String,
        enum: ['user', 'admin', 'driver', 'owner'],
        default: 'user'
    },
    otp: {
        type: Number
    },
    otpExpiary: {
        type: Date
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    isProfileComplete : {
        type:Boolean,
        default:false
    }

}, { timestamps: true })

// password hashing ...
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } catch (error) {
        return next(error)
    }
})


// create comparePassword function...
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password , this.password)
}

export const Users = model('user', userSchema)