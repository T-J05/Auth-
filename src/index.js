import express from "express"
import { PORT } from "./config"


const app = express()




app.post("/registrar",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})


app.post("/login",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})

app.post("/logout",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})


app.get("/vertodo",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})




app.patch("/",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})

app.delete("/",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})

app.put("/",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})




app.listen(PORT,"localhost",() =>{
    console.log(`Servidor corriendo en el puerto 3000`)
})