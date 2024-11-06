import express from 'express'
import { isAuthenticate } from '../middlewares/Authentication.js';
import { createDriverProfile } from '../controllers/driver.controlles.js';

const router = express.Router();

router
   .post('/', isAuthenticate , createDriverProfile)


export const driverRouter = router