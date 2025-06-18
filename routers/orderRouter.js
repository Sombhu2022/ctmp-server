import express from 'express'

import { addOrderIntoCart, changeDeliveryStatus, fetchAllOrderForAdminSection, findAllOrderDetails, findOrderRecipt, getOrderDetails, paymentVerification } from '../controllers/orderController.js'
import { isAdmin, isAuthenticate } from '../middlewares/Authentication.js'

const router =  express.Router()

router
 .get('/' , isAuthenticate , isAdmin , fetchAllOrderForAdminSection)
 .get('/orderDetails/:orderId', isAuthenticate , getOrderDetails )
 .get('/all' , isAuthenticate  , findAllOrderDetails)
 .post('/' , isAuthenticate , addOrderIntoCart)
//  .post('/status/:merchantTransactionId' , orderStatus)
 .post('/pay/:id', isAuthenticate ,  paymentVerification)
 .get('/recipt/:razorpay_payment_id' , isAuthenticate , findOrderRecipt)
 .post('/deliveryStatus/:orderId', isAuthenticate , isAdmin , changeDeliveryStatus )
 
export const orderRouter = router