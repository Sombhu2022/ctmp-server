import express from 'express'
import { isAuthenticate } from '../middlewares/Authentication.js';
import { changePassWithOtp, ChangePasswordWithOldPassword, createUser, deleteUser, forgotPassword, getUser, logInUser, logOutUser, updateUser } from '../controllers/user.contoller.js';


const router = express.Router();

router
   .get('/' , isAuthenticate , getUser)
   .post('/changePassword' ,isAuthenticate, ChangePasswordWithOldPassword )
   .post('/sendOtp' , forgotPassword)
   .post('/forgotPass',changePassWithOtp )
   .post('/register' , createUser)
   .post('/login' , logInUser )
   .get('/logout' ,isAuthenticate, logOutUser)
   .patch('/:id',isAuthenticate , updateUser)
   .delete('/:id', isAuthenticate ,deleteUser)

export const userRouter = router;