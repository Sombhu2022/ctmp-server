
import express from 'express'
import { isAuthenticate, isOwnerOrDriver } from '../middlewares/Authentication.js';
import { createNewVehicle, deleteVehicle } from '../controllers/vehicle.controller.js';




const router = express.Router();

router
   .post('/', isAuthenticate , isOwnerOrDriver , createNewVehicle)
   .delete('/:vehicleId' ,isAuthenticate , isOwnerOrDriver , deleteVehicle)


export const vehicleRouter = router