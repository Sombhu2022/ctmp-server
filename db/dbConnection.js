import mongoose from "mongoose";

export const dbConection=async()=>{
 
    try {
        await mongoose.connect(process.env.DB_URL)
        console.info("database connect")
    } catch (error) {
        console.error(error)
    }
}