import dotenv from "dotenv"
import express, { urlencoded } from "express"
import authRoutes from '../routes/auth.route.js'
import { connectoDB } from "../lib/db.js"
import  cookieParser  from "cookie-parser"
import messageRoute from '../routes/message.route.js'
import {app,server} from "../lib/socket.js"
import cors from "cors"
dotenv.config()
const port = process.env.PORT


app.get('/',(req,res)=>{
    res.send("this is working")
})
app.use(cors({
      origin: "https://chat-app-mern-stack-chi.vercel.app", 
    credentials: true,
}))
    
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({limit:'10mb',extended:true}))
app.use(cookieParser())
//routes
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoute)

server.listen(port,()=>{
    console.log(`the server is running on http://localhost:${port}`)
    connectoDB()
})
