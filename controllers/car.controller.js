import fileUpload from "express-fileupload"
import { Cars } from "../models/car.model"


export const createACar =  async(req , res)=>{
    try {
        const { id } = req.user 
        const { name , image , brand , area , rate } = req.body 
        // filde check 
        if(!name || !brand || !area || !rate){
            return res.status(400).json({
                message:"all filde  required !",
                success:false
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

        const car = await Cars.create({
            name , 
            image:tempImage,
            brand,
            area ,
            rate,
            userId:id
        })

        return res.status(200).json({
            message:"new car is added successfully",
            success:true,
            data:car
        })

    } catch (error) {
        return res.json({
            message:"something error , please try again !",
            success:false
        }).status(500)
    }
}