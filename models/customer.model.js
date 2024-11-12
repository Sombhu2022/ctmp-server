import { model, Schema } from "mongoose";


const transportSchema = new Schema(
    {
        vehicleId: {
            type: Schema.Types.ObjectId,
            ref: 'Vehicle',
        },
        transportDate: {
            type: Date,
            default: Date.now,
        },
        origin: {
            type: String,
            trim: true,
        },
        destination: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
)

const customerSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
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
        },
        address: {
            street: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            state: {
                type: String,
                trim: true,
            },
            zipCode: {
                type: String,
                trim: true,
                match: [/^[0-9]{5,6}$/, 'Please fill a valid postal code'],
            },
        },

        preferredTransportType: {
            type: String,
            enum: ['Truck', 'Van', 'Car', 'Bike', 'Other'],
            default: 'Other',
        },
        transportHistory: [  transportSchema ],

    },
    { timestamps: true }
);

export const Customers = model('Customer', customerSchema);
