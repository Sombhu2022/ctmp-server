// models/Owner.js
const { model } = require('mongoose');
const mongoose = require('mongoose');

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
            unique: true,
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
        quantity: {
            type: Number,
            required: true,
            min: 1,
        } ,
        available:{
            type: Number,
            required: true,
        }
    }
    ],
    
}, { timestamps: true });


export const Owners = model('owner', ownerSchema);
