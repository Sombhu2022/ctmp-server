
import express from 'express'
import { isAuthenticate, isOwnerOrDriver } from '../middlewares/Authentication.js';
import { createNewVehicle } from '../controllers/vehicle.controller.js';




const router = express.Router();

router
   .post('/', isAuthenticate , isOwnerOrDriver , createNewVehicle)


export const vehicleRouter = router