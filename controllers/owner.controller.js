
import mongoose from 'mongoose';
import { Owners } from '../models/owner.model.js';
import { Users } from '../models/user.model.js';  // Assuming you have a User model for user validation
import { Vehicles } from '../models/vehicle.model.js';  // Assuming you have a Vehicle model for validation

// Create Owner Profile
export const createOwnerProfile = async (req, res) => {
  const { contactInfo, vehicles } = req.body;
  const { id  } = req.user;
 console.log("------" , req.body);
 
  try {
    // Validate User ID: Ensure that the provided user exists in the database
    const existingUser = await Users.findById(id);
    if (!existingUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Validate Vehicle IDs: Ensure all vehicle references are valid
    const vehicleIds = vehicles.map((vehicle) => vehicle.vehicle);
    const validVehicles = await Vehicles.find({ '_id': { $in: vehicleIds } });
    if (validVehicles.length !== vehicles.length) {
      return res.status(400).json({ error: 'Invalid vehicle IDs provided' });
    }

    // Create the Owner Profile
    const newOwner = new Owners({
      user : id ,
      contactInfo,
      vehicles: vehicles.map((vehicle) => ( { vehicle: vehicle.vehicle  } )),
    });

    // Save the new Owner Profile to the database
    await newOwner.save();

    existingUser.isProfileComplete = true 
    await existingUser.save()

    return res.status(201).json({
      message: 'Owner profile created successfully!',
      owner: newOwner,
    });
  } catch (error) {
    console.error('Error creating owner profile:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};



// Change Car Availability Status
export const changeCarAvailability = async (req, res) => {
    const { ownerId, vehicleId, isAvailable } = req.body;

    try {
        // Check if owner exists
        const owner = await Owners.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        // Update vehicle availability
        const vehicle = await Vehicles.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        vehicle.isAvilableForRant = isAvailable;
        await vehicle.save();

        return res.status(200).json({ message: 'Car availability status updated', vehicle });
    } catch (error) {
        console.error('Error updating car availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch All Cars by Owner ID
export const getCarsByOwner = async (req, res) => {
  const { id } = req.user; // Ensure `req.user` contains the owner ID

  try {
    // Use aggregation pipeline to fetch owner details and join with vehicle collection
    const owners = await Owners.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } }, // Match owner by user ID
      {
        $lookup: {
          from: "vehicles", // Collection name of vehicles
          localField: "vehicles.vehicle", // Field in Owners schema
          foreignField: "_id", // Field in Vehicles schema
          as: "vehicleDetails", // Output array field
        },
      },
      {
        $project: {
          user: 1,
          contactInfo: 1,
          vehicleDetails: 1, // Include vehicle details
        },
      },
    ]);

    if (owners.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Owner found, return vehicle details
    return res.status(200).json({
      message: "Cars fetched successfully",
      cars: owners[0].vehicleDetails,
    });
  } catch (error) {
    console.error("Error fetching cars with aggregation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





// Get an owner profile by ID
export const getOwnerById = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const owner = await Owners.findById(ownerId).populate('user').populate('vehicles.vehicle');
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.status(200).json({ owner });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching owner profile' });
  }
};

// Update an existing owner profile
export const updateOwnerProfile = async (req, res) => {
  const { ownerId } = req.params;
  const { contactInfo, vehicles } = req.body;

  try {
    const updatedOwner = await Owners.findByIdAndUpdate(
      ownerId,
      { contactInfo, vehicles },
      { new: true, runValidators: true }
    );
    if (!updatedOwner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.status(200).json({ message: 'Owner profile updated successfully', owner: updatedOwner });
  } catch (error) {
    res.status(500).json({ error: 'Error updating owner profile' });
  }
};

// Delete an owner profile
export const deleteOwnerProfile = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const deletedOwner = await Owners.findByIdAndDelete(ownerId);
    if (!deletedOwner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.status(200).json({ message: 'Owner profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting owner profile' });
  }
};



