
import { Drivers } from "../models/driver.model.js";
import { Users } from "../models/user.model.js";

export const createDriverProfile = async (req, res) => {
    try {
        const { id } = req.user;
        // const id = "672b8165e74e9367fdd69cd6"
        const { address, typeOfCar, phone, isOwnCar, totalExprience, car } = req.body;
         console.info(req.body)
        // Validate required fields
        if (!address || !phone ) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }

        // Construct driver profile data
        const driverData = {
            phone,
            address,
            isOwnCar,
            typeOfCar,
            totalExprience,
            userId: id,
            ...(isOwnCar && { car }) 
        };

        // Create driver profile
        const driver = await Drivers.create(driverData);

        const user = await Users.findById(id)

        user.isProfileComplete = true;
        await user.save()

        return res.status(200).json({
            message: "Driver profile created successfully!",
            success: true,
            driver
        });

    } catch (error) {
        console.error("Error creating driver profile:", error);
        return res.status(500).json({
            message: "Something went wrong, please try again!",
            success: false
        });
    }
};


