import dotenv from "dotenv"
import express from "express"
import authRoutes from '../routes/auth.route.js'
import { connectoDB } from "../lib/db.js"
import  cookieParser  from "cookie-parser"
import messageRoute from '../routes/message.route.js'
import cors from "cors"
dotenv.config()
const port = process.env.PORT

const app =express()
app.get('/',(req,res)=>{
    res.send("this is working")
})
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
    
app.use(express.json())
app.use(cookieParser())
//routes
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoute)

app.listen(port,()=>{
    console.log(`the server is running on http://localhost:${port}`)
    connectoDB()
})
