import express from 'express';

import { isAuthenticate, isOwnerOrDriver } from '../middlewares/Authentication.js';
import { changeCarAvailability, createOwnerProfile, deleteOwnerProfile, getCarsByOwner, getOwnerById, updateOwnerProfile } from '../controllers/owner.controller.js';

const router = express.Router();

// Route to create a new owner profile
router.post('/create', isAuthenticate ,  createOwnerProfile);

// API to change car availability
router.put('/car-availability', isAuthenticate , isOwnerOrDriver , changeCarAvailability);

// API to fetch cars by owner ID
router.get('/cars', isAuthenticate ,  getCarsByOwner);

// Route to get an owner profile by its ID
router.get('/:ownerId',isAuthenticate ,  getOwnerById);

// Route to update an existing owner profile
router.put('/:ownerId/update',isAuthenticate,  updateOwnerProfile);

// Route to delete an owner profile
router.delete('/:ownerId/delete',isAuthenticate ,  deleteOwnerProfile);

export const ownerRouter =  router;
