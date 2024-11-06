import mongoose, { model, Schema } from "mongoose";

const reviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,   
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Assuming ratings are between 1 and 5
    },
    feedback: {
        type: String,
        maxLength: [600, 'Feedback should not exceed 600 characters'],
        trim: true,
    },
    reviewedEntity: {
        type: String,
        enum: ['driver', 'car', 'owner'], // Ensures the entity is one of these types
        required: true,
    },
    reviewedEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'reviewedEntity', // Dynamically references the collection based on `reviewedEntity`
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

export const Reviews = model('review', reviewSchema);
