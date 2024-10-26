import mongoose, { model, Schema } from "mongoose";


const typeOfCarModel= new Schema({
    name:{
        type:String
    },
    exprence:{
        type:Number
    }
}, {_id: false} ) 

export const driverSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        maxLength:10
    },
    typeOfCar:[ typeOfCarModel ],
    isOwnCar: {
        type:Boolean,
        default:false
    },
    totalExprence:{
        type:Number 
    },

} , { timestamps: true})

export const Drivers = model('Driver' , driverSchema)