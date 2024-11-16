import fileUpload from "express-fileupload"
import { Vehicles } from "../models/vehicle.model.js"



export const createNewVehicle =  async(req , res)=>{
    try {
        const { id } = req.user 
        const { name , modelNumber , image , brand , area , rate } = req.body 
        // filde check 
        if(!name || !brand || !area || !rate || !modelNumber){
            return res.status(400).json({
                message:"all filde  required !",
                success:false
            })
        }

        let vehicle = await Vehicles.findOne({ modelNumber })

        if(vehicle) {
            return res.status(400).json({ 
                message : "Vehicle alrady exist !"
            })
        }
   
        let tempImage = {
            url:'https://res.cloudinary.com/dab0ekhmy/image/upload/v1728130610/thik-ai/gvjpvq3xljmnw2vwdkag.avif',
            public_id:null
        }

        if(image) {
            const { url , public_id , error} = await fileUpload(image)
            if(error){
                return res.status(400).json({
                    message:"image not uploaded !"
                })
            }

            tempImage = {
                url,
                public_id
            }

        }

        vehicle = await Vehicles.create({
            name , 
            image:tempImage,
            brand,
            area ,
            rate,
            userId:id ,
            modelNumber 
        })

        return res.status(200).json({
            message:"new car is added successfully",
            success:true,
            data:vehicle
        })

    } catch (error) {
        return res.json({
            message:"something error , please try again !",
            success:false
        }).status(500)
    }
}