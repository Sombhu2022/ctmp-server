import express from 'express'
import 'dotenv/config'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary';
import { dbConection } from './db/dbConnection.js'
import { userRouter } from './routers/user.router.js'
import { driverRouter } from './routers/driver.router.js'
import { vehicleRouter } from './routers/vehicle.router.js'
import { ownerRouter } from './routers/owner.router.js'


const app = express()


app.use(bodyParser.json({limit:"50mb"}))
app.use(express.json({ limit: '50mb' }))

// Increase the request size limit for URL-encoded data
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(fileUpload(
    {
     limits: { fileSize: 50 * 1024 * 1024 }, // 100 MB (adjust this as needed)
    }
))

app.use(cookieParser())

// frontend connection by cors 
app.use(cors({
    origin: `${process.env.FRONTEND_URL}` || '*',
    exposedHeaders: ['X-Total-Count'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}
))

// cloude configration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_DB,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// connect database
 dbConection();

//  routing setup
app.use( '/api/v1/user', userRouter)
app.use('/api/v1/driver' , driverRouter)
app.use('/api/v1/vehicle' , vehicleRouter)
app.use('/api/v1/owner' , ownerRouter)


app.get('/' , ( req , res)=>{
       res.send("this is my ctms project ... ")
});


app.listen(process.env.PORT || 8000 , ()=>{
    console.log("server is running ");
    console.info(`port :- http://localhost:${process.env.PORT}`)
})