import express from 'express'
import 'dotenv/config'


const server = express()



server.get('/' , (req , res)=>{
     console.info('server is properly running')
     res.send("server is running")
})

server.listen(process.env.PORT || 8000 , ()=>{
    console.log("server is running ");
    console.info(`port :- http://localhost:${process.env.PORT}`)
})