import mongoose, { model } from "mongoose";

const ownerSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user' ,
        required : true
    },
    contactInfo: {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        },
        phone: {
            type: String,
            required: true,
            match: [/^[0-9]{10,15}$/, 'Please fill a valid phone number'],
        },
        address: {
            type: String,
            trim: true,
        },
    },
   
    vehicles: [{

        vehicle:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vechile',  
        },
      
    },{_id : false}
    ],
    
}, { timestamps: true });


export const Owners = model('owner', ownerSchema);
