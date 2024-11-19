
import { Vehicles } from "../models/vehicle.model.js"
import { fileDestroy, fileUploader } from "../utils/fileUpload.js"



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
            const { url , public_id , error} = await fileUploader(image)
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


export const deleteVehicle = async(req , res )=>{
    try {
        const { vehicleId } = req.params

         const vehicle = await Vehicles.findById(vehicleId)
   
         const { error , data , success } = await fileDestroy(vehicle.image.public_id)

         if(!success){
            return res.json({
                message:'server error , file not delete !' 
            }).status(400)
         }

        await Vehicles.findByIdAndUpdate(vehicleId)
        
        return res.json({
            message:'vehicle delete success ' ,
            success : true,
            data:vehicle
        }).status(200)

    } catch (error) {
        
        return res.status(500).json({ message : 'Internal server error , please try again !' , error , success:false})
    }
}