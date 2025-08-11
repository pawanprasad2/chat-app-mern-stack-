import dotenv from "dotenv"
import express from "express"
dotenv.config()
const port = process.env.PORT

const app =express()
app.get('/',(req,res)=>{
    res.send("this is working")
})

app.listen(port,()=>{
    console.log(`the server is running on http://localhost:${port}`)
})
