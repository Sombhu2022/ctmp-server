
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

export const fetchAllAvailableVehical = async(req , res)=>{

    try {
        const vehicle = await Vehicles.find({available: true})

        if(!vehicle) {
            return res.status(400).json({
                message: " No car available ",
                vehicle:[],
                success:true
            })
        }
        
        return res.status(200).json({
            message:"all available vehical detais find ",
            vehicle,
            success:true
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message:"Internal server error" ,
            error,
            success:false
        })
    }
}



export const fetchVehicleByVehicleType = async (req, res) => {
    try {
        const { carType } = req.body;

        // Validate input
        if (!carType) {
            return res.status(400).json({
                message: "carType is required",
            });
        }

        // Check if the carType is valid based on the schema's enum
        const validCarTypes = ['car', 'bike', 'bus', 'truck', 'van', 'tractor', 'auto-rickshaw', 'jeep', 'cycle'];
        if (!validCarTypes.includes(carType)) {
            return res.status(400).json({
                message: `Invalid carType. Valid options are: ${validCarTypes.join(', ')}`,
            });
        }

        // Query the database for vehicles of the specified type
        const vehicles = await Vehicles.find({ vehicleType: carType });

        // If no vehicles found, return a 404 response
        if (!vehicles.length) {
            return res.status(404).json({
                message: `No vehicles found for the type: ${carType}`,
            });
        }

        // Respond with the list of vehicles
        return res.status(200).json({
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        console.error("Error fetching vehicles by carType:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error,
        });
    }
};


export const fetchVehicleByLocation = async(req , res) =>{
    try {
        
    } catch (error) {
        
    }
}