import dotenv from "dotenv"
import express from "express"
import authRoutes from '../routes/auth.route.js'
import { connectoDB } from "../lib/db.js"
import  cookieParser  from "cookie-parser"
dotenv.config()
const port = process.env.PORT

const app =express()
app.get('/',(req,res)=>{
    res.send("this is working")
})
app.use(express.json())
app.use(cookieParser())
//routes
app.use("/api/auth",authRoutes)

app.listen(port,()=>{
    console.log(`the server is running on http://localhost:${port}`)
    connectoDB()
})
