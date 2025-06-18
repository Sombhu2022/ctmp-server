
import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const orderSchema =new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
 
    phone:{
        type:Number,
        maxLength:10
    },
    orderFor :{
        type : String ,
        default : "long-trip"
    } ,
    
    orderDetails:{
       name : {
         type : String ,

       } ,
       day : {
        type : String
       } ,
    },
    totalAmmount:{
        type:Number,
        default:0
    },
    deliveryCharge:{
        type:Number,
        default:0
    } ,
    paymentType:{
        type:String,
        default:"online"
    },
    paymentStatus:{
        type:String,
        enum:['panding' , 'success' , 'rejected'],
        default:'panding'
    },
    deliveryStatus:{
         type:String,
         default:"pending"
    },
    razorpay_order_id: {
        type: String,
        // required: true,
      },
      razorpay_payment_id: {
        type: String,
        // required: true,
      },
      razorpay_signature: {
        type: String,
        // required: true,
      },
} , {timestamps:true})

export const Orders = model('order' , orderSchema);
